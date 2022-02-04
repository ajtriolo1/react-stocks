const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const yahooFinance = require('yahoo-finance');
const moment = require('moment');
var bigdecimal = require('bigdecimal');
const path = require('path');

const Transaction = mongoose.model('Transaction');
const Portfolio = mongoose.model('Portfolio');
const User = mongoose.model('User');

const router = express.Router();

//router.use(requireAuth);

router.get('/api/transactions', requireAuth, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id });

  if (transactions.length === 0) {
    res.send([]);
  }

  res.send(transactions);
});

router.post('/api/sell', requireAuth, async (req, res) => {
  const { ticker, price, quantity } = req.body;

  if (!ticker || !price || !quantity) {
    return res
      .status(422)
      .send({ message: 'Please provide a ticker, price, and quantity' });
  }

  const buys = await Transaction.find({
    userId: req.user._id,
    ticker: ticker,
    transaction_type: 'buy',
    owned: { $gt: 0 },
  });
  const stock = await Portfolio.find({ userId: req.user._id, ticker: ticker });
  const user = await User.findById(req.user._id);

  if (stock.length === 0 || stock[0].quantity < quantity) {
    return res
      .status(422)
      .send({ message: 'Not enough or none of that stock is owned' });
  }

  let remaining = quantity;
  let newTotal = stock[0].total;

  await buys.reduce(async (memo, buy) => {
    await memo;
    if (remaining === 0) {
      return true;
    }
    //console.log(bigdecimal.BigDecimal(buy.owned).multiply(bigdecimal.BigDecimal(buy.price)).floatValue())
    if (buy.owned < remaining) {
      remaining -= buy.owned;
      if (buy.price > 1.0) {
        newTotal -= buy.price * buy.owned;
        newTotal = Math.round((newTotal + Number.EPSILON) * 1000) / 1000;
      } else {
        newTotal -= buy.price * buy.owned;
      }
      await Transaction.findOneAndUpdate(
        { userId: req.user._id, _id: buy._id },
        { owned: 0 },
        { new: true }
      ).clone();
    } else {
      const newOwned = buy.owned - remaining;
      if (buy.price > 1.0) {
        newTotal -= remaining * buy.price;
        newTotal = Math.round((newTotal + Number.EPSILON) * 1000) / 1000;
      } else {
        newTotal -= remaining * buy.price;
      }
      remaining = 0;
      await Transaction.findOneAndUpdate(
        { userId: req.user._id, _id: buy._id },
        { owned: newOwned },
        { new: true }
      ).clone();
    }
  }, undefined);

  const transaction = new Transaction({
    userId: req.user._id,
    ticker,
    price,
    total:
      price > 1.0
        ? Math.round(price * quantity * 1000) / 1000
        : price * quantity,
    quantity,
    transaction_type: 'sell',
    date: moment
      .tz(moment(), 'America/New_York')
      .format('MMMM Do YYYY, h:mm:ss a'),
  });

  //const newDoc = await Transaction.find({userId: req.user._id, ticker:ticker, transaction_type:'buy', owned:{$gt:0}})
  const newQuantity = stock[0].quantity - quantity;
  // let newTotal = 0
  // newDoc.forEach((buy) => {
  //     newTotal += (buy.price*buy.owned);
  // })

  try {
    if (newQuantity === 0) {
      await Portfolio.findOneAndDelete({
        userId: req.user._id,
        ticker: ticker,
      });
    } else {
      await Portfolio.findOneAndUpdate(
        { userId: req.user._id, ticker: ticker },
        { quantity: newQuantity, total: newTotal }
      );
    }
    await transaction.save();
    await User.findByIdAndUpdate(req.user._id, {
      balance: user.balance + price * quantity,
    });
    res.send('Success!');
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
});

router.post('/api/buy', requireAuth, async (req, res) => {
  const { ticker, price, quantity } = req.body;

  if (!ticker || !price || !quantity) {
    return res
      .status(422)
      .send({ message: 'Please provide a ticker, price, and quantity' });
  }

  const stock = await Portfolio.find({ userId: req.user._id, ticker: ticker });
  const user = await User.findById(req.user._id);

  if (stock.length === 0) {
    const item = new Portfolio({
      userId: req.user._id,
      ticker,
      total:
        price > 1.0
          ? Math.round(price * quantity * 1000) / 1000
          : price * quantity,
      quantity,
    });
    await item.save();
  } else {
    const newQuantity = stock[0].quantity + quantity;
    let newTotal = stock[0].total;
    if (price > 1.0) {
      newTotal += price * quantity;
      newTotal = Math.round((newTotal + Number.EPSILON) * 1000) / 1000;
    } else {
      newTotal += price * quantity;
    }
    await Portfolio.findOneAndUpdate(
      { userId: req.user._id, ticker: ticker },
      { quantity: newQuantity, total: newTotal }
    );
  }

  const transaction = new Transaction({
    userId: req.user._id,
    ticker,
    price,
    quantity,
    total:
      price > 1.0
        ? Math.round(price * quantity * 1000) / 1000
        : price * quantity,
    transaction_type: 'buy',
    owned: quantity,
    date: moment
      .tz(moment(), 'America/New_York')
      .format('MMMM Do YYYY, h:mm:ss a'),
  });

  try {
    await transaction.save();
    await User.findByIdAndUpdate(req.user._id, {
      balance: user.balance - price * quantity,
    });
    res.send('Success!');
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
});

module.exports = router;
