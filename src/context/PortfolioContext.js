import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks';

const portfolioReducer = (state, action) => {
    switch (action.type){
        case 'fetch_transactions':
            return {...state, transactionList:action.payload}
        default:
            return state
    }
}

const getTransactions = dispatch => async () => {
    const res = await stocksApi.get('/transactions')
    dispatch({type:'fetch_transactions', payload: res.data})
}

export const {Provider, Context} = createDataContext(
    portfolioReducer,
    {getTransactions},
    {transactionList: []}
)