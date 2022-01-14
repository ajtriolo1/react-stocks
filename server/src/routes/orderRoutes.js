const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const moment = require('moment');

const Order = mongoose.model('Order')

const router = express.Router();

router.use(requireAuth);

router.get('/orders', async (req, res) => {
    const orders = await Order.find({userId: req.user._id})

    if (orders.length === 0){
        return res.send([])
    }

    res.send(orders)
})

router.post('/order', async (req, res) => {
    const {ticker, price, quantity, order_type, buy_sell} = req.body;

    if (!ticker || !price || !quantity || !order_type || !buy_sell){
        return res.status(422).send({message: 'Please provide a ticker, price, and quantity'});
    }

    const order = new Order({
        userId: req.user._id,
        ticker,
        price,
        quantity,
        buy_sell,
        order_type,
        date: moment().format('MMMM Do YYYY, h:mm:ss a')
    })

    try{
        await order.save()
        res.send(order)
    }catch (err){
        res.status(422).send({message: err.message})
    }
})

router.delete('/order/:id', async (req, res) => {
    const id = req.params.id
    await Order.findOneAndDelete({
        _id: id
    })
    res.send(id)
})

module.exports = router;