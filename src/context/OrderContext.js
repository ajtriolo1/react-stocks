import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks'

const orderReducer = (state, action) => {
    switch(action.type){
        case 'fetch_orders':
            return {...state, orderList:action.payload}
        case 'add_order':
            return {...state, orderList: [...state.orderList, action.payload]}
        case 'delete_order':
            return {...state, orderList: state.orderList.filter(element => element._id !== action.payload)}
        default:
            return state
    }
}

const fetchOrders = dispatch => async() => {
    const res = await stocksApi.get('/orders');
    dispatch({type:'fetch_orders', payload: res.data})
}

const addOrder = dispatch => async(ticker, price, quantity, order_type, buy_sell) => {
    try{
        const res = await stocksApi.post('/order', {ticker, price, quantity, order_type, buy_sell});
        dispatch({type: 'add_order', payload:res.data})
    }catch(err){
        return err.response.data.message
    }
}

const deleteOrder = dispatch => async(id) => {
    const res = await stocksApi.delete(`/order/${id}`);
    dispatch({type:'delete_order', payload:res.data})
}

export const {Provider, Context} = createDataContext(
    orderReducer,
    {fetchOrders, deleteOrder, addOrder},
    {orderList: []}
)