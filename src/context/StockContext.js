import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks';
import StockChart from "../components/StockChart";

const stockReducer = (state, action) => {
    switch(action.type){
        case 'fetch_stocks':
            const tickers = Object.keys(action.payload);
            const charts = [];
            const selectedIntervals = {}
            tickers.forEach(ticker => {
                charts.push(
                    <StockChart
                        id={ticker}
                        key={ticker}
                        ticker={ticker} 
                        data={action.payload[ticker]}
                    />
                )
                selectedIntervals[ticker] = '1d'
            });
            return {
                ...state,
                chartList: charts,
                tickerList: tickers,
                selectedIntervals: selectedIntervals
            }
        case 'add_stock':
            const ticker = Object.keys(action.payload)[0];
            const chart =
                <StockChart 
                    id={ticker}
                    key={ticker}
                    ticker={ticker} 
                    data={action.payload[ticker]}
                />
            return {...state, chartList: [...state.chartList, chart], tickerList:[...state.tickerList, ticker], selectedIntervals:{...state.selectedIntervals, [ticker]:'1d'}}
        case 'delete_stock':
            return {
                stocksList: Object.fromEntries(Object.entries(state.stocksList).filter(([key]) => key !== action.payload)),
                chartList: state.chartList.filter(element => element.props.id !== action.payload), 
                tickerList: state.tickerList.filter(element => element !== action.payload),
                selectedIntervals: Object.fromEntries(Object.entries(state.selectedIntervals).filter(([key]) => key !== action.payload))
            }
        case 'fetch_list':
            return{...state, stocksList:action.payload}
        case 'reset':
            return {stocksList:{}, chartList:[], tickerList:[], selectedIntervals:{}}
        case 'selected_interval':
            const selectedTicker = action.payload.ticker
            const newInterval = action.payload.interval
            return {...state, selectedIntervals:{...state.selectedIntervals, [selectedTicker]:newInterval}}
        default:
            return state;
    }
}

const fetchStocks = dispatch => async() => {
    const res = await stocksApi.get('/stocks');
    dispatch({type:'fetch_stocks', payload: res.data});
};

const addStock = dispatch => async (ticker) => {
    const res = await stocksApi.post('/stocks', {ticker});
    dispatch({type:'add_stock', payload:res.data})
}

const deleteStock = dispatch => async(ticker) => {
    const res = await stocksApi.delete(`/stocks/${ticker}`);
    dispatch({type:'delete_stock', payload:res.data});
}

const resetStocks = dispatch => () => {
    dispatch({type:'reset'})
}

const fetchList = dispatch => async() => {
    const res = await stocksApi.get('/list');
    dispatch({type:'fetch_list', payload:res.data})
}

const setSelectedInterval = dispatch => ({ticker, interval}) => {

    dispatch({type: 'selected_interval', payload:{ticker, interval}})
}

export const {Provider, Context} = createDataContext(
    stockReducer,
    {fetchStocks, addStock, deleteStock, resetStocks, fetchList, setSelectedInterval},
    {chartList:[], tickerList:[], stocksList:{}, selectedIntervals:{}}
)