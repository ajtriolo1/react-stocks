import createDataContext from './createDataContext';
import stocksApi from '../api/stocks';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: { form: action.payload } };
    case 'signin':
      return { ...state, errorMessage: '', token: action.payload };
    case 'signout':
      return {
        token: null,
        errorMessage: '',
        userInfo: { firstName: '', lastName: '', email: '' },
      };
    case 'user_info':
      return { ...state, userInfo: action.payload };
    case 'update_email':
      return {
        ...state,
        errorMessage: '',
        userInfo: { ...state.userInfo, email: action.payload },
      };
    default:
      return state;
  }
};

const signup =
  (dispatch) =>
  async ({ email, password, firstName, lastName }, navigate) => {
    try {
      const res = await stocksApi.post('/signup', {
        email,
        password,
        firstName,
        lastName,
      });
      await localStorage.setItem('token', res.data.token);
      dispatch({ type: 'signin', payload: res.data.token });

      navigate('/charts');
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Something went wrong with signup',
      });
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password }, navigate) => {
    try {
      const response = await stocksApi.post('/signin', {
        email,
        password,
      });
      await localStorage.setItem('token', response.data.token);
      dispatch({ type: 'signin', payload: response.data.token });

      navigate('/charts');
    } catch (err) {
      dispatch({ type: 'add_error', payload: err.response.data.message });
    }
  };

const signout = (dispatch) => async (navigate) => {
  await localStorage.removeItem('token');
  dispatch({ type: 'signout' });
  navigate('/login');
};

const tryLocalSignin = (dispatch) => async (navigate) => {
  const token = await localStorage.getItem('token');
  if (token) {
    dispatch({ type: 'signin', payload: token });
    navigate('/charts');
  } else {
    dispatch({ type: 'signout' });
    navigate('/login');
  }
};

const getUserInfo = (dispatch) => async () => {
  const response = await stocksApi.get('/user-info');
  dispatch({ type: 'user_info', payload: response.data });
};

const changeEmail =
  (dispatch) =>
  async ({ newEmail }) => {
    try {
      const response = await stocksApi.put('/email', { newEmail });
      dispatch({ type: 'update_email', payload: response.data });
    } catch (err) {
      dispatch({ type: 'add_error', payload: err.response.data.message });
      return err.response.data.message;
    }
  };

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, tryLocalSignin, getUserInfo, changeEmail },
  {
    token: null,
    errorMessage: { form: '' },
    userInfo: { firstName: '', lastName: '', email: '' },
  }
);
