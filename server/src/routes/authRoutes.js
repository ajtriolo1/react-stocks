const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const user = new User({ email, password, firstName, lastName });
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token });
    } catch(err){
        return res.status(422).send({error: err.message});
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password){
        return res.status(422).send({ message: 'Must provide email and password' });
    }
    if(!email){
        return res.status(422).send({ message: 'Must provide email' }); 
    }
    if(!password){
        return res.status(422).send({ message: 'Must provide password' });
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(422).send({ message: 'Invalid password or email' });
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token });
    } catch (err){
        res.status(422).send({ message: 'Invalid password or email' });
    }
});

module.exports = router;