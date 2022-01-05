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

router.post('/sell', async (req, res) => {
    const {ticker, price, quantity} = req.body;

    if (!ticker || !price || !quantity){
        return res.status(422).send({error: 'Please provide a ticker, price, and quantity'});
    }

    const buys = await Transaction.find({userId: req.user._id, ticker:ticker, transaction_type:'buy', owned:{$gt:0}})
    const stock = await Portfolio.find({userId: req.user._id, ticker:ticker})

    if(stock.length === 0 || stock[0].quantity < quantity){
        return res.status(422).send({error: 'Not enough or none of that stock is owned'})
    }

    let remaining = quantity;

    await buys.reduce(async (memo, buy) => {
        await memo
        if(remaining === 0){
            console.log('here')
            return true;
        }
        if(buy.owned < remaining){
            remaining -= buy.owned
            await Transaction.findOneAndUpdate({userId: req.user._id, _id: buy._id}, {owned: 0}, {new:true}).clone()
        }else{
            const newOwned = buy.owned-remaining
            remaining = 0
            await Transaction.findOneAndUpdate({userId: req.user._id, _id: buy._id}, {owned: newOwned}, {new:true}).clone()
        }
    }, undefined);

    const transaction = new Transaction({
        userId:req.user._id, 
        ticker, 
        price,
        total: price*quantity, 
        quantity, 
        transaction_type:'sell',
        date: moment().format('MMMM Do YYYY, h:mm:ss a')
    });

    const newDoc = await Transaction.find({userId: req.user._id, ticker:ticker, transaction_type:'buy', owned:{$gt:0}})
    const newQuantity = stock[0].quantity - quantity
    let newTotal = 0
    newDoc.forEach((buy) => {
        newTotal += (buy.price*buy.owned);
    })

    try{
        if(newQuantity === 0){
            await Portfolio.findOneAndDelete({userId: req.user._id, ticker:ticker})
        }else{
            await Portfolio.findOneAndUpdate({userId: req.user._id, ticker: ticker}, {quantity:newQuantity, total:newTotal})
        }
        await transaction.save()
        res.send('Success!')
    }catch(err){
        res.status(422).send({error: err.message})
    }

})

router.post('/buy', async (req, res) => {
    const {ticker, price, quantity} = req.body;

    if (!ticker || !price || !quantity){
        return res.status(422).send({error: 'Please provide a ticker, price, and quantity'});
    }

    const stock = await Portfolio.find({userId: req.user._id, ticker:ticker})

    if(stock.length === 0){
        const item = new Portfolio({
            userId: req.user._id,
            ticker,
            total: price*quantity,
            quantity
        })
        await item.save()
    }else{
        const newQuantity = stock[0].quantity + quantity
        const newTotal = stock[0].total + (price*quantity)
        await Portfolio.findOneAndUpdate({userId: req.user._id, ticker: ticker}, {quantity:newQuantity, total:newTotal})
    }

    const transaction = new Transaction({
        userId:req.user._id, 
        ticker, 
        price, 
        quantity,
        total: price*quantity, 
        transaction_type:'buy',
        owned: quantity,
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