const express = require('express');
const { append } = require('express/lib/response');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const moment = require('moment');
const yahooFinance = require('yahoo-finance');
const yahooFinance2 = require('yahoo-finance2').default;
const path = require('path');

const Stock = mongoose.model('Stock');
const User = mongoose.model('User');
const Portfolio = mongoose.model('Portfolio');

const router = express.Router();

//router.use(requireAuth);

router.get('/api/list', requireAuth, async (req, res) => {
  const stocks = await Stock.find({ userId: req.user._id });
  const owned = await Portfolio.find({ userId: req.user._id });
  const startDate = moment().subtract(3, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  const tickers = [];

  if (stocks.length === 0) {
    return res.send([]);
  }

  stocks.forEach((stock) => {
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

router.get('/api/stocks', requireAuth, async (req, res) => {
  const stocks = await Stock.find({ userId: req.user._id });
  const startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  const tickers = [];
  results = {};

  stocks.forEach((stock) => {
    tickers.push(stock.ticker);
  });

  if (tickers.length === 0) {
    return res.send([]);
  }

  for (let i = 0; i < 100; i++) {
    try {
      await Promise.all(
        tickers.map(async (ticker) => {
          const shortname = await yahooFinance2.quoteSummary(ticker, {
            modules: ['quoteType'],
          });
          results[ticker] = {
            shortname: shortname['quoteType']['shortName'],
            '1d': await yahooFinance2._chart(
              ticker,
              {
                period1: moment().format('YYYY-MM-DD') + 'T14:30:00.000Z',
                period2: moment().format(),
                interval: '15m',
              },
              { validateResult: false }
            ),
            '1wk': await yahooFinance2._chart(
              ticker,
              {
                period1: moment().subtract(1, 'week').format('YYYY-MM-DD'),
                interval: '1h',
              },
              { validateResult: false }
            ),
            '1mo': await yahooFinance2._chart(
              ticker,
              {
                period1: moment().subtract(1, 'month').format('YYYY-MM-DD'),
                interval: '1d',
              },
              { validateResult: false }
            ),
            '3mo': await yahooFinance2._chart(
              ticker,
              {
                period1: moment().subtract(3, 'months').format('YYYY-MM-DD'),
                interval: '1d',
              },
              { validateResult: false }
            ),
            '1yr': await yahooFinance2._chart(
              ticker,
              {
                period1: moment().subtract(1, 'year').format('YYYY-MM-DD'),
                interval: '1d',
              },
              { validateResult: false }
            ),
          };
          // results[stock.ticker] = {"1d":result_1d['quotes'], "1wk":result_1wk['quotes'], "1mo":result_1mo['quotes'], "3mo":result_3mo['quotes'], "1yr":result_1yr['quotes']}
        })
      );
      break;
    } catch (err) {
      setTimeout(() => {
        console.log('error');
      }, 1000);
    }
  }

  if (tickers.length === 0) {
    return res.send([]);
  }

  // yahooFinance.historical(
  //     {
  //         symbols: tickers,
  //         from: startDate,
  //         to: endDate
  //     },
  //     function (err, quotes) {
  //         if (err){
  //             return res.status(422).send({error: 'Error fetching stock info'})
  //         }
  //         res.send(quotes);
  //         res.end();
  //     }
  // );

  res.send(results);
});

router.post('/api/stocks', requireAuth, async (req, res) => {
  const { ticker } = req.body;

  if (!ticker) {
    return res.status(422).send({ error: 'You must provide a ticker symbol' });
  }

  const results = {};

  try {
    const startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    results[ticker] = {
      '1d': await yahooFinance2._chart(
        ticker,
        {
          period1: moment().format('YYYY-MM-DD') + 'T14:30:00.000Z',
          period2: moment().format(),
          interval: '15m',
        },
        { validateResult: false }
      ),
      '1wk': await yahooFinance2._chart(
        ticker,
        {
          period1: moment().subtract(1, 'week').format('YYYY-MM-DD'),
          interval: '1h',
        },
        { validateResult: false }
      ),
      '1mo': await yahooFinance2._chart(
        ticker,
        {
          period1: moment().subtract(1, 'month').format('YYYY-MM-DD'),
          interval: '1d',
        },
        { validateResult: false }
      ),
      '3mo': await yahooFinance2._chart(
        ticker,
        {
          period1: moment().subtract(3, 'months').format('YYYY-MM-DD'),
          interval: '1d',
        },
        { validateResult: false }
      ),
      '1yr': await yahooFinance2._chart(
        ticker,
        {
          period1: moment().subtract(1, 'year').format('YYYY-MM-DD'),
          interval: '1d',
        },
        { validateResult: false }
      ),
    };
    if (results[ticker]['1d']['quotes'].length === 0) {
      throw `${ticker} does not exist or has no data`;
    }
    const stock = new Stock({ ticker, userId: req.user._id });
    await stock.save();
    res.send(results);
  } catch (err) {
    if (err instanceof String) {
      return res.status(404).send({ message: err });
    }
    return res
      .status(404)
      .send({ message: `${ticker} does not exist or has no data` });
  }
});

router.get('/api/historical/:ticker', requireAuth, async (req, res) => {
  const ticker = req.params.ticker.trim();

  var results = {};

  for (let i = 0; i < 100; i++) {
    try {
      results[ticker] = {
        '1d': await yahooFinance2._chart(
          ticker,
          {
            period1: moment().format('YYYY-MM-DD') + 'T14:30:00.000Z',
            period2: moment().format(),
            interval: '15m',
          },
          { validateResult: false }
        ),
        '1wk': await yahooFinance2._chart(
          ticker,
          {
            period1: moment().subtract(1, 'week').format('YYYY-MM-DD'),
            interval: '1h',
          },
          { validateResult: false }
        ),
        '1mo': await yahooFinance2._chart(
          ticker,
          {
            period1: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            interval: '1d',
          },
          { validateResult: false }
        ),
        '3mo': await yahooFinance2._chart(
          ticker,
          {
            period1: moment().subtract(3, 'months').format('YYYY-MM-DD'),
            interval: '1d',
          },
          { validateResult: false }
        ),
        '1yr': await yahooFinance2._chart(
          ticker,
          {
            period1: moment().subtract(1, 'year').format('YYYY-MM-DD'),
            interval: '1d',
          },
          { validateResult: false }
        ),
      };
      if (results[ticker]['1d']['quotes'].length === 0) {
        throw `${ticker} does not exist or has no data`;
      }
      break;
    } catch (err) {
      if (err instanceof String) {
        return res.status(404).send({ message: err });
      } else {
        return res
          .status(404)
          .send({ message: `${ticker} does not exist or has no data` });
      }
      setTimeout(() => {
        console.log('error');
      }, 1000);
    }
  }

  res.send(results);
});

router.get('/api/quote/:ticker', requireAuth, (req, res) => {
  const ticker = req.params.ticker;

  yahooFinance.quote(
    {
      symbol: ticker,
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

router.delete('/api/stocks/:ticker', requireAuth, async (req, res) => {
  const ticker = req.params.ticker;
  await Stock.findOneAndDelete({
    userId: req.user._id,
    ticker: ticker,
  });
  res.send(ticker);
});

router.get('/api/user-info', requireAuth, async (req, res) => {
  const user = await User.find({ _id: req.user._id });
  const firstName = user[0].firstName;
  const lastName = user[0].lastName;
  const email = user[0].email;
  res.send({ firstName, lastName, email });
});

router.put('/api/email', requireAuth, async (req, res) => {
  const { newEmail } = req.body;
  try {
    await User.findByIdAndUpdate({ _id: req.user._id }, { email: newEmail });
    res.send(newEmail);
  } catch (err) {
    res.status(422).send({ message: 'Duplicate Email' });
  }
});

router.post('/api/autocomplete', requireAuth, async (req, res) => {
  var { value } = req.body;

  value = value.trim();

  if (!value) {
    return res.send([]);
  }

  const results = await yahooFinance2.search(value);

  var response = results['quotes'].filter((el) => {
    return el.isYahooFinance === true;
  });

  res.send(response);
});

module.exports = router;
