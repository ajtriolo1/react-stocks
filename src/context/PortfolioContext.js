import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks';

const portfolioReducer = (state, action) => {
    switch (action.type){
        case 'fetch_transactions':
            action.payload.forEach((transaction) => {
                if(transaction.total > 1.0){
                    transaction.total = transaction.transaction_type === 'buy' ? `-$${transaction.total.toFixed(2)}` : `+$${transaction.total.toFixed(2)}`
                }else{
                    transaction.total = transaction.transaction_type === 'buy' ? `-$${transaction.total}` : `+$${transaction.total}`
                }  
            })
            return {...state, transactionList:action.payload}
        case 'fetch_portfolio':
            return {...state, portfolio:action.payload}
        case 'fetch_quotes':
            return {...state, portfolioQuotes:action.payload, loadingQuotes:false}
        case 'set_loading':
            return {...state, loadingQuotes:true}
        default:
            return state
    }
}

const getTransactions = dispatch => async () => {
    const res = await stocksApi.get('/transactions')
    dispatch({type:'fetch_transactions', payload: res.data})
}

const getPortfolio = dispatch => async () => {
    const res = await stocksApi.get('/portfolio')
    dispatch({type:'fetch_portfolio', payload:res.data})
}

const getPortfolioQuotes = dispatch => async () => {
    dispatch({type:'set_loading'})
    const res = await stocksApi.get('/portfolio/quotes')
    dispatch({type:'fetch_quotes', payload:res.data})
}

const buyStock = dispatch => async (ticker, price, quantity) => {
    try{
        const res = await stocksApi.post('/buy', {ticker, price, quantity})
    }catch (err){
        if (err.response.data.message.includes('Please provide')){
            return ('Please provide a valid number of shares')
        }else{
            return err.response.data.message
        }
    }
}

const sellStock = dispatch => async (ticker, price, quantity) => {
    try{
        const res = await stocksApi.post('/sell', {ticker, price, quantity})
    }catch(err){
        if (err.response.data.message.includes('Please provide')){
            return ('Please provide a valid number of shares')
        }else{
            return err.response.data.message
        }
        
    }
}

export const {Provider, Context} = createDataContext(
    portfolioReducer,
    {getTransactions, buyStock, sellStock, getPortfolio, getPortfolioQuotes},
    {transactionList: [], portfolio:{}, portfolioQuotes:{}, loadingQuotes:true}
)