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

  var currDate = moment(startDate, 'MM/DD/YYYY')
    .subtract(1, 'days')
    .startOf('day');
  var lastDate = moment(endDate, 'MM/DD/YYYY').add(1, 'days').startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.format('YYYY-MM-DD'));
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
  const { startDate, endDate } = req.body;
  const tickers = await Transaction.distinct('ticker', {
    userId: req.user._id,
  });

  const transactions = await Transaction.find({ userId: req.user._id });
  const first = transactions[0];
  const firstDate = moment(first['date'], 'MMMM Do YYYY').format('MM/DD/YYYY');

  var dates = enumerateBetweenDates(firstDate, endDate);
  var values = [];
  var data = {};
  var currOwned = {};
  var prevPrices = {};

  tickers.forEach((ticker) => {
    currOwned[ticker] = 0;
  });

  // await tickers.reduce(async (memo, ticker) => {
  //   await memo;
  //   data[ticker] = await yahooFinance2.historical(ticker, {
  //     period1: moment(firstDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
  //     period2: moment(endDate, 'MM-DD-YYYY')
  //       .add(1, 'days')
  //       .format('YYYY-MM-DD'),
  //     interval: '1d',
  //   });
  //   currOwned[ticker] = 0;
  // }, undefined);

  await Promise.all(
    tickers.map(async (ticker) => {
      data[ticker] = await yahooFinance2.historical(ticker, {
        period1: moment(firstDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        period2: moment(endDate, 'MM/DD/YYYY')
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        interval: '1d',
      });
      currOwned[ticker] = 0;
    })
  );

  // var allBuys = await Transaction.find({
  //   userId: req.user._id,
  //   transaction_type: 'buy',
  // });

  // var allSells = await Transaction.find({
  //   userId: req.user._id,
  //   transaction_type: 'sell',
  // });

  var allTransactions = await Transaction.find({
    userId: req.user._id,
  });

  dates.forEach((date) => {
    var currValue = 0;
    tickers.forEach((ticker) => {
      var bought = allTransactions.reduce((sum, buy) => {
        return buy.transaction_type === 'buy' &&
          buy.ticker === ticker &&
          moment(buy.date, 'MMMM Do YYYY, h:mm:ss a').format('YYYY-MM-DD') ===
            date
          ? sum + parseInt(buy.quantity)
          : sum;
      }, 0);
      var sold = allTransactions.reduce((sum, sell) => {
        return sell.transaction_type === 'sell' &&
          sell.ticker === ticker &&
          moment(sell.date, 'MMMM Do YYYY, h:mm:ss a').format('YYYY-MM-DD') ===
            date
          ? sum + parseInt(sell.quantity)
          : sum;
      }, 0);
      var adjusted = bought - sold;
      currOwned[ticker] += adjusted;
      var currDate = moment(`${date}T00:00:00.000Z`).toDate();
      var matching = data[ticker].filter(
        (quote) => quote.date.toString() === currDate.toString()
      );
      var price = 0;
      if (matching.length > 0) {
        price = matching[0]['close'];
        prevPrices[ticker] = price;
        currValue += currOwned[ticker] * price;
      } else {
        currValue += currOwned[ticker] * prevPrices[ticker];
      }
    });
    values.push(currValue);
  });

  var startIndex = dates.indexOf(
    moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')
  );
  if (startIndex != -1) {
    dates = dates.slice(startIndex);
    values = values.slice(startIndex);
  }
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
