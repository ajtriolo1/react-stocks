import { useContext, useEffect } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResolveAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { tryLocalSignin } = useContext(AuthContext);

  if (token && children) {
    return children;
  } else if (token) {
    tryLocalSignin(navigate);
    return null;
  } else {
    tryLocalSignin(navigate);
    return null;
  }
};

export default ResolveAuth;
