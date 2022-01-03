import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks';
import StockChart from "../components/StockChart";

const stockReducer = (state, action) => {
    switch(action.type){
        case 'fetch_stocks':
            const tickers = Object.keys(action.payload);
            const charts = [];
            tickers.forEach(ticker => {
                charts.push(
                    <StockChart
                        key={ticker}
                        id={ticker} 
                        ticker={ticker} 
                        data={action.payload[ticker]}
                    />
                )
            });
            return {
                ...state,
                chartList: charts,
                tickerList: tickers
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
            return {...state, chartList: [...state.chartList, chart], tickerList:[...state.tickerList, ticker]}
        case 'delete_stock':
            return {
                stocksList: Object.fromEntries(Object.entries(state.stocksList).filter(([key]) => key !== action.payload)),
                chartList: state.chartList.filter(element => element.props.id !== action.payload), 
                tickerList: state.tickerList.filter(element => element !== action.payload)
            }
        case 'fetch_list':
            return{...state, stocksList:action.payload}
        case 'reset':
            return {stocksList:{}, chartList:[], tickerList:[]}
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
    dispatch({type:'delete_stock', payload:res.data})
}

const resetStocks = dispatch => () => {
    dispatch({type:'reset'})
}

const fetchList = dispatch => async() => {
    const res = await stocksApi.get('/list');
    dispatch({type:'fetch_list', payload:res.data})
}

export const {Provider, Context} = createDataContext(
    stockReducer,
    {fetchStocks, addStock, deleteStock, resetStocks, fetchList},
    {chartList:[], tickerList:[], stocksList:{}}
)