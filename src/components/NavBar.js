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
  CircularProgress,
  InputBase,
  Autocomplete,
  Typography,
} from '@mui/material';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as StockContext } from '../context/StockContext';
import { Context as PortfolioContext } from '../context/PortfolioContext';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/styles';

const Search = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginTop: 16,
  marginBottom: 16,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signout } = useContext(AuthContext);
  const {
    state: { options },
    autoComplete,
    clearOptions,
    resetStocks,
    getSingleStockHistorical,
  } = useContext(StockContext);
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
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

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

  const handleSingleStockSubmit = async (event, stock = undefined) => {
    event.preventDefault();
    var tick = searchStock;
    if (stock) {
      tick = stock;
    }
    setSearchStock('');
    setOpen(false);
    clearOptions();
    setSearching(true);
    if (tick.trim().length === 0) {
      setSearching(false);
      toast.error('Please provide a ticker');
      return;
    }
    const res = await toast.promise(
      getSingleStockHistorical(tick.trim().toUpperCase()),
      {
        error: {
          render({ data }) {
            setSearching(false);
            return data;
          },
        },
      }
    );
    if (res) {
      return;
    }
    setSearching(false);
    document.getElementById('single-stock-search').blur();
    navigate(`/stock/${tick.trim().toUpperCase()}`);
  };

  return (
    <>
      <AppBar sx={{ width: 'auto' }} position='static'>
        <Toolbar>
          <Button
            sx={{ my: 2, color: 'white', display: 'block' }}
            key='watchlist'
            onClick={() => navigate('/watchlist')}
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
              sx={{ mr: '48px' }}
              component='form'
              onSubmit={(event) => handleSingleStockSubmit(event)}
            >
              <Search>
                <Autocomplete
                  id='single-stock-search'
                  style={{ width: '260px' }}
                  freeSolo
                  disableClearable
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  options={options}
                  filterOptions={(x) => x}
                  getOptionLabel={(option) => {
                    if (option.symbol) {
                      return `${option.symbol} - ${option.shortname}`;
                    } else {
                      return option;
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.symbol === value.symbol
                  }
                  inputValue={searchStock}
                  value={searchStock}
                  onChange={(event, value, reason) => {
                    if (reason === 'reset') {
                      setSearchStock('');
                      return;
                    } else {
                      if (value !== null) {
                        setSearchStock(value.symbol);
                        handleSingleStockSubmit(event, value.symbol);
                      }
                    }
                  }}
                  renderInput={(params) => {
                    const { InputLabelProps, InputProps, ...rest } = params;
                    return (
                      <StyledInputBase
                        {...params.InputProps}
                        {...rest}
                        value={searchStock}
                        placeholder='Ticker...'
                        startAdornment={
                          <SearchIcon sx={{ ml: 1.5, mt: '2px' }} />
                        }
                        endAdornment={
                          searching ? (
                            <CircularProgress
                              size={20}
                              sx={{ marginRight: '5px' }}
                            />
                          ) : null
                        }
                        onChange={(event) => {
                          if (
                            event.target.value !== '' ||
                            event.target.value !== null
                          ) {
                            setSearchStock(event.target.value);
                            autoComplete(event.target.value);
                          }
                        }}
                      />
                    );
                  }}
                />
              </Search>
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
              <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
              <MenuItem onClick={onSignoutClick}>
                Logout
                <LogoutIcon sx={{ ml: '5px' }} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={aboutOpen} sx={{ mb: 5 }}>
        <DialogTitle>
          <Box display='flex' alignItems='center'>
            <Box flexGrow={1}>About</Box>
            <Box>
              <IconButton onClick={() => setAboutOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection={'column'} maxWidth={'600px'}>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              This is a simulated stock trading app built in React.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              To buy or sell stocks, either add them to your watchlist and open
              the list view or search for a stock using the search bar in the
              top right.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              Your balance is displayed on the right side of the navigation bar.
              Try clicking it to deposit funds.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              The watchlist is used to display trends and information about
              stocks that you are interested in.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              The portfolio page displays information about stocks that you
              currently own. You can buy or sell more of the stocks you have by
              clicking on the stock within the table.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              The orders page displays any limit orders you have placed.
            </Typography>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              You can access all of the transactions you have made by visiting
              the transactions page found in the user menu.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
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
