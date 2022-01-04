const mongoose = require('mongoose');
const moment = require('moment');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticker: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    transaction_type: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
});

mongoose.model('Transaction', transactionSchema);