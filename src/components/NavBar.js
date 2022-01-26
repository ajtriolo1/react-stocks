import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  Link,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  DialogActions,
} from '@mui/material';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as StockContext } from '../context/StockContext';
import { Context as PortfolioContext } from '../context/PortfolioContext';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

const NavBar = () => {
  const navigate = useNavigate();
  const { signout } = useContext(AuthContext);
  const { resetStocks } = useContext(StockContext);
  const {
    state: { balance },
    fetchBalance,
    deposit,
    resetPortfolio,
  } = useContext(PortfolioContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [searchStock, setSearchStock] = useState('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const onSignoutClick = () => {
    signout(navigate);
    resetStocks();
    resetPortfolio();
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setDepositAmount('');
    setDialogOpen(false);
  };

  const handleDeposit = async () => {
    await deposit(parseFloat(depositAmount));
    setDepositAmount('');
    setDialogOpen(false);
  };

  return (
    <>
      <AppBar sx={{ width: 'auto' }} position='static'>
        <Toolbar>
          <Button
            sx={{ my: 2, color: 'white', display: 'block' }}
            key='charts'
            onClick={() => navigate('/charts')}
          >
            Charts
          </Button>
          <Button
            sx={{ my: 2, color: 'white', display: 'block' }}
            key='list'
            onClick={() => navigate('/list')}
          >
            Watchlist
          </Button>
          <Button
            sx={{ my: 2, color: 'white', display: 'block' }}
            key='portfolio'
            onClick={() => navigate('/portfolio')}
          >
            Portfolio
          </Button>
          <Button
            sx={{ my: 2, color: 'white', display: 'block' }}
            key='orders'
            onClick={() => navigate('/orders')}
          >
            Orders
          </Button>
          <Box
            sx={{
              display: 'flex',
              my: 2,
              position: 'absolute',
              right: 30,
            }}
          >
            <Box
              sx={{ mr: 6 }}
              component='form'
              onSubmit={(event) => {
                event.preventDefault();
                setSearchStock('');
                navigate(`/stock/${searchStock}`);
              }}
            >
              <TextField
                value={searchStock}
                placeholder='Ticker...'
                onChangeCapture={(event) => setSearchStock(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Link
              sx={{ mt: '1.5px', mr: '30px' }}
              alignSelf='center'
              underline='none'
              color='white'
              variant='h6'
              component='button'
              onClick={() => setDialogOpen(true)}
            >
              {`$${balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })}`}
            </Link>
            <IconButton
              sx={{ alignSelf: 'center' }}
              size='large'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: '40px' }}
              id='account-menu'
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
              <MenuItem onClick={() => navigate('/account')}>Account</MenuItem>
              <MenuItem onClick={onSignoutClick}>
                Logout
                <LogoutIcon sx={{ ml: '5px' }} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={dialogOpen} sx={{ mb: 15 }}>
        <DialogTitle>
          <Box display='flex' alignItems='center'>
            <Box sx={{ width: '88%', flexShrink: 0 }}>Deposit</Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection={'column'} marginTop='10px'>
            <TextField
              sx={{
                '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                  {
                    display: 'none',
                  },
                flexShrink: 0,
              }}
              inputProps={{
                min: 0,
                type: 'number',
                step: '0.001',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ mt: '2.4px' }} position='start'>
                    $
                  </InputAdornment>
                ),
              }}
              id='deposit-amount'
              label='Amount'
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleDeposit}>Deposit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
