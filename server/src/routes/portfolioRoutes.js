const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Portfolio = mongoose.model('Portfolio');

const router = express.Router();

router.use(requireAuth);

module.exports = router;