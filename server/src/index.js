require('./models/User');
require('./models/Stock');
require('./models/Transaction');
require('./models/Portfolio');
require('./models/Order')
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const orderRoutes = require('./routes/orderRoutes')
const requireAuth = require('./middlewares/requireAuth');


const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(authRoutes)
app.use(transactionRoutes);
app.use(portfolioRoutes);
app.use(stockRoutes);
app.use(orderRoutes);
app.disable('etag');

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.my9iz.mongodb.net/StocksDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
  useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
});

//create a server object:
// app.get('*', (req, res) => {
//   const ticker = req.query.ticker
//   const startDate = req.query.startDate
//   const endDate = req.query.endDate

//   yahooFinance.historical(
//     {
//       symbol: ticker,
//       from: startDate,
//       to: endDate
//     },
//     function (err, quotes) {
//       res.send(quotes); //write a response to the client
//       res.end(); //end the response
//     }
//   );
// });

app.get('/', requireAuth, (req,res) => {
  res.send(`Your email: ${req.user.email}`);
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});