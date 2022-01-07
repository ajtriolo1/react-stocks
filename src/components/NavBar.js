import React, {useContext, useState} from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import {Context as AuthContext} from '../context/AuthContext'
import {Context as StockContext} from '../context/StockContext'
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

const NavBar = () => {
    const navigate = useNavigate();
    const {signout} = useContext(AuthContext)
    const {resetStocks} = useContext(StockContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const onSignoutClick = () => {
        signout(navigate);
        resetStocks();
        setAnchorEl(null);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <AppBar sx={{width:'auto'}} position='static'>
            <Toolbar>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} key="charts" onClick={() => navigate('/charts')}>
                    Charts
                </Button>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} key="list" onClick={() => navigate('/list')}>
                    List
                </Button>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} key="portfolio" onClick={() => navigate('/portfolio')}>
                    Portfolio
                </Button>
                <Box sx={{my:2, position:'absolute', right:30}}>
                    <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                    <Menu
                        sx={{mt: '40px'}}
                        id="account-menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >   
                        <MenuItem onClick={() => navigate('/transactions')}>
                            Transactions
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/account')}>
                            Account
                        </MenuItem>
                        <MenuItem onClick={onSignoutClick}>
                            Logout
                            <LogoutIcon sx={{ml:'5px'}}/>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;