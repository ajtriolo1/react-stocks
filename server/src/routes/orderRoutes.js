const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const moment = require('moment');

const Order = mongoose.model('Order');
const Portfolio = mongoose.model('Portfolio');

const router = express.Router();

router.use(requireAuth);

router.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });

  if (orders.length === 0) {
    return res.send([]);
  }

  res.send(orders);
});

router.post('/order', async (req, res) => {
  const { ticker, price, quantity, order_type, buy_sell } = req.body;

  if (!ticker || !price || !quantity || !order_type || !buy_sell) {
    return res
      .status(422)
      .send({ message: 'Please provide a ticker, price, and quantity' });
  }

  if (buy_sell === 'sell') {
    const stock = await Portfolio.find({
      userId: req.user._id,
      ticker: ticker,
    });
    if (stock.length === 0 || stock[0].quantity < quantity) {
      return res
        .status(422)
        .send({ message: 'Not enough or none of that stock is owned' });
    }
  }

  const order = new Order({
    userId: req.user._id,
    ticker,
    price,
    quantity,
    buy_sell,
    order_type,
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
  });

  try {
    await order.save();
    res.send(order);
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
});

router.delete('/order/:id', async (req, res) => {
  const id = req.params.id;
  await Order.findOneAndDelete({
    _id: id,
  });
  res.send(id);
});

module.exports = router;
