import React, {useContext} from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {Context as AuthContext} from '../context/AuthContext'
import {Context as StockContext} from '../context/StockContext'
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const {signout} = useContext(AuthContext)
    const {resetStocks} = useContext(StockContext);

    const onSignoutClick = () => {
        signout(navigate);
        resetStocks();
    }

    return (
        <AppBar position='static'>
            <Toolbar>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} key="charts" onClick={() => navigate('/charts')}>
                    Charts
                </Button>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} key="list" onClick={() => navigate('/list')}>
                    List
                </Button>
                <Button sx={{ my:2, position:'absolute', right:10 }} color="signout" variant="contained" onClick={() => onSignoutClick()}>Sign Out</Button>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;