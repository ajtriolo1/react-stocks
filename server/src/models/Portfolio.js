const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
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
    total: {
        type: Number,
        default: 0
    }
});

mongoose.model('Portfolio', portfolioSchema);