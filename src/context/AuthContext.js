import createDataContext from "./createDataContext";
import stocksApi from '../api/stocks';

const authReducer = (state, action) => {
    switch(action.type){
        case 'add_error':
            return {...state, errorMessage: {form:action.payload}};
        case 'signin':
            return {errorMessage: '', token: action.payload};
        case 'signout':
            return {token: null, errorMessage: ''};
        default:
            return state;
    }
}


const signup = dispatch => async ({email, password, firstName, lastName}, navigate) => {
    try{
        const res = await stocksApi.post('/signup', {email, password, firstName, lastName});
        await localStorage.setItem('token', res.data.token);
        dispatch({ type: 'signin', payload:res.data.token });

        navigate('/charts')
    }catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with signup' })
    }
}

const signin = dispatch => async ({ email, password }, navigate) => {
    try{
        const response = await stocksApi.post('/signin', {email, password});
        await localStorage.setItem('token', response.data.token);
        dispatch({ type: 'signin', payload: response.data.token});

        navigate('/charts')
    }catch (err) {
        dispatch({ type:'add_error', payload: err.response.data.message });
    }
};

const signout = dispatch => async(navigate) => {
    await localStorage.removeItem('token');
    dispatch({type:'signout'});
    navigate('/login');
};

const tryLocalSignin = dispatch => async(navigate) => {
    const token = await localStorage.getItem('token');
    if(token){
        dispatch({type:'signin', payload:token})
        navigate('/charts')
    }else{
        dispatch({type:'signout'});
        navigate('/login')
    }
}

export const {Provider, Context} = createDataContext(
    authReducer,
    {signup, signin, signout, tryLocalSignin},
    {token: null, errorMessage: {form:''}}
)