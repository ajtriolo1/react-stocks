import createDataContext from './createDataContext';
import stocksApi from '../api/stocks';
import StockChart from '../components/StockChart';

const stockReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_stocks':
      const tickers = Object.keys(action.payload)[0];
      const plot = (
        <StockChart
          id={tickers}
          key={tickers}
          ticker={tickers}
          data={action.payload[tickers]}
        />
      );
      return {
        ...state,
        chartList: [...state.chartList, plot],
        tickerList: [...state.tickerList, tickers],
        loadedCharts: true,
      };
    // const tickers = Object.keys(action.payload);
    // const charts = [];
    // tickers.forEach((ticker) => {
    //   charts.push(
    //     <StockChart
    //       id={ticker}
    //       key={ticker}
    //       ticker={ticker}
    //       data={action.payload[ticker]}
    //     />
    //   );
    // });
    // return {
    //   ...state,
    //   chartList: charts,
    //   tickerList: tickers,
    // };
    case 'add_stock':
      const ticker = Object.keys(action.payload)[0];
      const chart = (
        <StockChart
          id={ticker}
          key={ticker}
          ticker={ticker}
          data={action.payload[ticker]}
        />
      );
      return {
        ...state,
        chartList: [...state.chartList, chart],
        tickerList: [...state.tickerList, ticker],
      };
    case 'delete_stock':
      return {
        ...state,
        stocksList: Object.fromEntries(
          Object.entries(state.stocksList).filter(
            ([key]) => key !== action.payload
          )
        ),
        chartList: state.chartList.filter(
          (element) => element.props.id !== action.payload
        ),
        tickerList: state.tickerList.filter(
          (element) => element !== action.payload
        ),
      };
    case 'fetch_list':
      const ticks = Object.keys(action.payload);
      return { ...state, stocksList: action.payload, tickerList: ticks };
    case 'reset':
      return {
        stocksList: {},
        chartList: [],
        tickerList: [],
        singleStockHistorical: null,
        options: [],
        loadedCharts: false,
      };
    case 'single_stock_hist':
      return { ...state, singleStockHistorical: action.payload };
    case 'single_stock_quote':
      return { ...state, singleStockQuote: action.payload };
    case 'reset_single':
      return {
        ...state,
        singleStockHistorical: null,
        singleStockQuote: null,
      };
    case 'get_autocomplete':
      return { ...state, options: action.payload };
    case 'reset_options':
      return { ...state, options: [] };
    case 'set_charts_loaded':
      return { ...state, loadedCharts: true };
    default:
      return state;
  }
};

// const fetchStocks = (dispatch) => async () => {
//   const res = await stocksApi.get('/stocks');
//   dispatch({ type: 'fetch_stocks', payload: res.data });
// };

const fetchStocks = (dispatch) => async () => {
  const result = await stocksApi.get('/tickers');
  const tickers = result.data;
  if (tickers.length === 0) {
    dispatch({ type: 'set_charts_loaded' });
  }
  await Promise.all(
    tickers.map(async (ticker) => {
      const res = await stocksApi.get(`/historical/${ticker}`);
      dispatch({ type: 'fetch_stocks', payload: res.data });
    })
  );
};

const addStock = (dispatch) => async (ticker) => {
  try {
    const res = await stocksApi.post('/stocks', { ticker });
    dispatch({ type: 'add_stock', payload: res.data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err.response.data.message);
  }
};

const deleteStock = (dispatch) => async (ticker) => {
  const res = await stocksApi.delete(`/stocks/${ticker}`);
  dispatch({ type: 'delete_stock', payload: res.data });
};

const resetStocks = (dispatch) => () => {
  dispatch({ type: 'reset' });
};

const fetchList = (dispatch) => async () => {
  const res = await stocksApi.get('/list');
  dispatch({ type: 'fetch_list', payload: res.data });
};

const getSingleStockHistorical = (dispatch) => async (ticker) => {
  try {
    const res = await stocksApi.get(`/historical/${ticker}`);
    dispatch({ type: 'single_stock_hist', payload: res.data[ticker] });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err.response.data.message);
  }
};

const getSingleStockQuote = (dispatch) => async (ticker) => {
  try {
    const res = await stocksApi.get(`/quote/${ticker}`);
    dispatch({ type: 'single_stock_quote', payload: res.data });
  } catch (err) {
    return err.response.data.message;
  }
};

const resetSingleStock = (dispatch) => () => {
  dispatch({ type: 'reset_single' });
};

const autoComplete = (dispatch) => async (value) => {
  const res = await stocksApi.post('/autocomplete', { value });
  dispatch({ type: 'get_autocomplete', payload: res.data });
};

const clearOptions = (dispatch) => () => {
  dispatch({ type: 'reset_options' });
};

export const { Provider, Context } = createDataContext(
  stockReducer,
  {
    fetchStocks,
    addStock,
    deleteStock,
    resetStocks,
    fetchList,
    getSingleStockHistorical,
    getSingleStockQuote,
    resetSingleStock,
    autoComplete,
    clearOptions,
  },
  {
    chartList: [],
    tickerList: [],
    stocksList: {},
    singleStockHistorical: null,
    singleStockQuote: null,
    options: [],
    loadedCharts: false,
  }
);
