const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const yahooFinance = require('yahoo-finance');
const yahooFinance2 = require('yahoo-finance2').default;
const path = require('path');
const moment = require('moment');

const Portfolio = mongoose.model('Portfolio');
const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');

const router = express.Router();

const enumerateBetweenDates = function (startDate, endDate) {
  var dates = [];

  var currDate = moment(startDate, 'MM-DD-YYYY')
    .subtract(1, 'days')
    .startOf('day');
  var lastDate = moment(endDate, 'MM-DD-YYYY').startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.format('MMMM D YYYY'));
  }

  return dates;
};

router.get('/api/portfolio', requireAuth, async (req, res) => {
  const portfolio = await Portfolio.find({ userId: req.user._id });

  if (portfolio.length === 0) {
    return res.send([]);
  }

  var result = {};

  portfolio.forEach((stock) => {
    result[stock.ticker] = stock;
  });

  res.send(result);
});

router.post('/api/portfolio/history', requireAuth, async (req, res) => {
  const { endDate } = req.body;
  const tickers = await Transaction.distinct('ticker', {
    userId: req.user._id,
  });

  const transactions = await Transaction.find({ userId: req.user._id });
  const first = transactions[0];
  const startDate = (startDate = moment(first['date'], 'MMMM Do YYYY').format(
    'MM-DD-YYYY'
  ));

  const dates = enumerateBetweenDates(startDate, endDate);
  var values = [];
  var data = {};
  var currOwned = {};
  var prevPrices = {};

  tickers.forEach((ticker) => {
    currOwned[ticker] = 0;
  });

  await tickers.reduce(async (memo, ticker) => {
    await memo;
    data[ticker] = await yahooFinance2.historical(ticker, {
      period1: moment(startDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
      period2: moment(endDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
      interval: '1d',
    });
    currOwned[ticker] = 0;
  }, undefined);

  await dates.reduce(async (memo, date) => {
    await memo;
    var currValue = 0;
    var month = date.split(' ')[0];
    var day = date.split(' ')[1];
    var year = date.split(' ')[2];
    await tickers.reduce(async (memo, ticker) => {
      await memo;
      var bought = await Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            ticker: ticker,
            transaction_type: 'buy',
            date: { $regex: `${month} ${day}.* ${year}` },
          },
        },
        {
          $group: {
            _id: null,
            quantity: { $sum: '$quantity' },
          },
        },
      ]);
      if (bought.length === 0) {
        bought = 0;
      } else {
        bought = bought[0]['quantity'];
      }
      var sold = await Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            ticker: ticker,
            transaction_type: 'sell',
            date: { $regex: `${month} ${day}.* ${year}` },
          },
        },
        {
          $group: {
            _id: null,
            quantity: { $sum: '$quantity' },
          },
        },
      ]);
      if (sold.length === 0) {
        sold = 0;
      } else {
        sold = sold[0]['quantity'];
      }
      var adjusted = bought - sold;
      currOwned[ticker] += adjusted;
      var currDate = moment(
        `${moment(date, 'MMMM D YYYY').format('YYYY-MM-DD')}T00:00:00.000Z`
      ).toDate();
      var matching = data[ticker].filter(
        (quote) => Object.values(quote)[0].toString() === currDate.toString()
      );
      var price = 0;
      if (matching.length > 0) {
        price = matching[0]['close'];
        prevPrices[ticker] = price;
        currValue += currOwned[ticker] * price;
      } else {
        currValue += currOwned[ticker] * prevPrices[ticker];
      }
    }, undefined);
    values.push(currValue);
  }, undefined);
  res.send({ dates, values });
});

router.get('/api/portfolio/quotes', requireAuth, async (req, res) => {
  const portfolio = await Portfolio.find({ userId: req.user._id });
  let tickers = [];

  if (portfolio.length === 0) {
    return res.send([]);
  }

  portfolio.forEach((stock) => {
    tickers.push(stock.ticker);
  });

  yahooFinance.quote(
    {
      symbols: tickers,
      modules: ['price'],
    },
    function (err, quotes) {
      if (err) {
        return res.status(422).send({ error: 'Error fetching stock info' });
      }
      res.send(quotes);
      res.end();
    }
  );
});

router.get('/api/balance', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

router.post('/api/deposit', requireAuth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user._id);
  const bal = user.balance;
  const newBal = bal + amount;

  try {
    await User.findByIdAndUpdate(req.user._id, { balance: bal + amount });
    res.send({ balance: newBal });
  } catch (err) {
    return res.status(422).send({ message: 'Error adding to balance' });
  }
});

module.exports = router;
