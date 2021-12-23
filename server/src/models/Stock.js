const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticker: {
        type: String,
        default: '',
    }
});

mongoose.model('Stock', stockSchema);