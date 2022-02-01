import { useContext, useEffect, useState } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResolveAuth = ({ children }) => {
  const navigate = useNavigate();
  const { checkToken } = useContext(AuthContext);

  useEffect(() => {
    checkToken(navigate, children);
  }, []);
  return children ? children : null;
};

export default ResolveAuth;
