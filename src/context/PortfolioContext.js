import createDataContext from './createDataContext';
import stocksApi from '../api/stocks';

const portfolioReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_transactions':
      var transactions = action.payload;
      transactions.forEach((transaction) => {
        if (transaction.transaction_type === 'buy') {
          transaction.str_total = `-$${transaction.total.toLocaleString(
            'en-US',
            { minimumFractionDigits: 2, maximumFractionDigits: 10 }
          )}`;
        } else {
          transaction.str_total = `$${transaction.total.toLocaleString(
            'en-US',
            { minimumFractionDigits: 2, maximumFractionDigits: 10 }
          )}`;
        }
      });
      return { ...state, transactionList: transactions };
    case 'fetch_portfolio':
      return { ...state, portfolio: action.payload };
    case 'fetch_quotes':
      return { ...state, portfolioQuotes: action.payload };
    case 'fetch_balance':
      return { ...state, balance: action.payload };
    case 'deposit':
      return { ...state, balance: parseFloat(action.payload) };
    case 'reset':
      return {
        transactionList: [],
        portfolio: {},
        portfolioQuotes: {},
        balance: 0.0,
        history: {},
      };
    case 'get_history':
      return { ...state, history: action.payload };
    default:
      return state;
  }
};

const getTransactions = (dispatch) => async () => {
  const res = await stocksApi.get('/transactions');
  dispatch({ type: 'fetch_transactions', payload: res.data });
};

const getPortfolio = (dispatch) => async () => {
  const res = await stocksApi.get('/portfolio');
  dispatch({ type: 'fetch_portfolio', payload: res.data });
};

const getPortfolioQuotes = (dispatch) => async () => {
  const res = await stocksApi.get('/portfolio/quotes');
  dispatch({ type: 'fetch_quotes', payload: res.data });
};

const buyStock = (dispatch) => async (ticker, price, quantity) => {
  try {
    const res = await stocksApi.post('/buy', { ticker, price, quantity });
    return Promise.resolve();
  } catch (err) {
    if (err.response.data.message.includes('Please provide')) {
      return Promise.reject('Please provide a valid number of shares');
    } else {
      return err.response.data.message;
    }
  }
};

const sellStock = (dispatch) => async (ticker, price, quantity) => {
  try {
    const res = await stocksApi.post('/sell', { ticker, price, quantity });
    return Promise.resolve();
  } catch (err) {
    if (err.response.data.message.includes('Please provide')) {
      return Promise.reject('Please provide a valid number of shares');
    } else {
      return Promise.reject(err.response.data.message);
    }
  }
};

const fetchBalance = (dispatch) => async () => {
  try {
    const res = await stocksApi.get('/balance');
    dispatch({ type: 'fetch_balance', payload: res.data.balance });
  } catch (err) {
    return err.response.data.message;
  }
};

const deposit = (dispatch) => async (amount) => {
  const res = await stocksApi.post('/deposit', { amount });
  dispatch({ type: 'deposit', payload: res.data.balance });
};

const resetPortfolio = (dispatch) => () => {
  dispatch({ type: 'reset' });
};

const getHistorical = (dispatch) => async (startDate, endDate) => {
  const res = await stocksApi.post('/portfolio/history', {
    startDate,
    endDate,
  });
  dispatch({ type: 'get_history', payload: res.data });
};

export const { Provider, Context } = createDataContext(
  portfolioReducer,
  {
    getTransactions,
    buyStock,
    sellStock,
    getPortfolio,
    getPortfolioQuotes,
    fetchBalance,
    deposit,
    resetPortfolio,
    getHistorical,
  },
  {
    transactionList: [],
    portfolio: {},
    portfolioQuotes: {},
    balance: 0.0,
    history: { dates: [], values: [] },
  }
);
