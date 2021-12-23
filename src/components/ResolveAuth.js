import { useContext, useEffect } from 'react';
import {Context as AuthContext} from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResolveAuth = () => {
    const {tryLocalSignin} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        tryLocalSignin(navigate);
    }, []);

    return null;
}

export default ResolveAuth;