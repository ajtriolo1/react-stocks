const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const yahooFinance = require('yahoo-finance');

const Portfolio = mongoose.model('Portfolio');
const User = mongoose.model('User');

const router = express.Router();

router.use(requireAuth);

router.get('/portfolio', async (req, res) => {
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

router.get('/portfolio/quotes', async (req, res) => {
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

router.get('/balance', async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

router.post('/deposit', async (req, res) => {
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
