const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const yahooFinance2 = require('yahoo-finance2').default;
const moment = require('moment');

const Transaction = mongoose.model('Transaction');
const Portfolio = mongoose.model('Portfolio');

const router = express.Router();

router.use(requireAuth);

router.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find({userId: req.user._id});
    
    if(transactions.length === 0){
        res.send([]);
    }

    res.send(transactions)

})

router.post('/buy', async (req, res) => {
    const {ticker, price, quantity} = req.body;

    if (!ticker || !price || !quantity){
        return res.status(422).send({error: 'Please provide a ticker, and quantity'});
    }

    const stock = await Portfolio.find({userId: req.user._id, ticker:ticker})

    const quote = await yahooFinance2.quote(ticker, {fields:['regularMarketPrice']})
    const currentPrice = quote['regularMarketPrice']

    if(stock.length === 0){
        const item = new Portfolio({
            userId: req.user._id,
            ticker,
            total: currentPrice*quantity,
            quantity
        })
        await item.save()
    }else{
        const newQuantity = stock[0].quantity + quantity
        const newTotal = newQuantity*currentPrice
        await Portfolio.findOneAndUpdate({userId: req.user._id, ticker: ticker}, {quantity:newQuantity, total:newTotal})
    }

    const transaction = new Transaction({
        userId:req.user._id, 
        ticker, 
        price, 
        quantity, 
        transaction_type:'buy',
        date: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
    
    try{
        await transaction.save()
        res.send('Success!')
    }catch(err){
        res.status(422).send({error: err.message})
    }
})

module.exports = router;