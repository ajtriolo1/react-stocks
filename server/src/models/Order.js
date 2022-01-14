const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticker: {
        type: String,
        default: ''
    },
    order_type: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    buy_sell: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
})

mongoose.model('Order', orderSchema)