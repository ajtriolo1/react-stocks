require('./models/User');
require('./models/Stock');
require('./models/Transaction');
require('./models/Portfolio');
require('./models/Order');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

console.log();

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.static(path.resolve(__dirname, '../../build')));

app.use(bodyParser.json());
app.use(authRoutes);
app.use(transactionRoutes);
app.use(portfolioRoutes);
app.use(stockRoutes);
app.use(orderRoutes);
app.disable('etag');

const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.my9iz.mongodb.net/StocksDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'), (err) => {
    if (err) {
      console.log(err);
    }
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Listening on port 8080');
});
