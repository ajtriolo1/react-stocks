import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Context as PortfolioContext } from '../context/PortfolioContext';
import { Context as OrderContext } from '../context/OrderContext';
import { toast } from 'react-toastify';

const BuySellForm = ({ stock, value, callback }) => {
  const [inputVal, setInputVal] = useState({});
  const [orderType, setOrderType] = useState('Market');
  const {
    state: { portfolio, balance },
    buyStock,
    sellStock,
    getPortfolio,
    fetchBalance,
    deposit,
  } = useContext(PortfolioContext);
  const { addOrder } = useContext(OrderContext);
  const [orderPrice, setOrderPrice] = useState('');
  const currentPrice = value.price.regularMarketPrice;
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    getPortfolio();
  }, []);

  const onSubmit = async (event, price, ticker) => {
    event.preventDefault();
    const name = event.nativeEvent.submitter.name;
    const data = new FormData(event.currentTarget);
    var res = undefined;
    if (orderType === 'Market') {
      if (name === 'buy') {
        if (balance < price * parseInt(data.get('quantity'))) {
          return setAlertOpen(true);
        }
        res = await toast.promise(
          buyStock(ticker, price, parseInt(data.get('quantity'))),
          {
            success: `Successfully bought ${data.get('quantity')} ${ticker}`,
            error: {
              render({ data }) {
                getPortfolio();
                return data;
              },
            },
          }
        );
      } else {
        res = await toast.promise(
          sellStock(ticker, price, parseInt(data.get('quantity'))),
          {
            success: `Successfully sold ${data.get('quantity')} ${ticker}`,
            error: {
              render({ data }) {
                getPortfolio();
                return data;
              },
            },
          }
        );
      }
    } else {
      res = await toast.promise(
        addOrder(
          ticker,
          orderPrice,
          parseInt(data.get('quantity')),
          orderType,
          name
        ),
        {
          success: `Successfully placed ${orderType.toLowerCase()} order for ${ticker}`,
          error: {
            render({ data }) {
              setInputVal({ ...inputVal, [ticker]: '' });
              setOrderType('Market');
              setOrderPrice('');
              return data;
            },
          },
        }
      );
    }
    if (res) {
      return;
    }
    setInputVal({ ...inputVal, [ticker]: '' });
    setOrderType('Market');
    setOrderPrice('');
    getPortfolio();
    fetchBalance();
    if (callback) {
      callback(false);
    }
  };

  const onConfirm = async (price, quantity, ticker) => {
    const required = price * quantity - balance;
    await deposit(required);
    const res = await toast.promise(
      buyStock(ticker, price, parseInt(quantity)),
      {
        success: `Successfully bought ${quantity} ${ticker}`,
        error: {
          render({ data }) {
            return data;
          },
          style: { width: '360px' },
        },
      }
    );
    if (res) {
      return;
    }
    setOrderType('Market');
    setInputVal({ ...inputVal, [ticker]: '' });
    getPortfolio();
    fetchBalance();
    setAlertOpen(false);
  };

  return (
    <>
      {portfolio[stock] ? (
        <Typography
          alignSelf={'center'}
          color='green'
        >{`You currently own ${portfolio[stock].quantity} shares of ${stock}`}</Typography>
      ) : null}
      <Box
        component='form'
        sx={{ display: 'flex', m: 'auto' }}
        onSubmit={(event) => onSubmit(event, currentPrice, stock)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 6 }}>
          <Box my={2} display={'flex'} justifyContent={'center'}>
            <Typography variant='h3'>
              {currentPrice > 1.0
                ? `$${currentPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3,
                  })}`
                : `$${currentPrice}`}
            </Typography>
          </Box>
          <Box display='flex' marginBottom={1} gap={2}>
            <TextField
              id='quantity'
              name='quantity'
              label='Shares'
              fullWidth
              sx={{
                '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                  {
                    display: 'none',
                  },
                width: '50%',
              }}
              inputProps={{
                min: 1,
                style: { textAlign: 'center' },
                type: 'number',
              }}
              onChange={(event) =>
                setInputVal({
                  ...inputVal,
                  [stock]: event.target.value,
                })
              }
              value={inputVal[stock] || ''}
            />
            <FormControl sx={{ width: '50%' }}>
              <InputLabel id='order-type-select-label'>Order Type</InputLabel>
              <Select
                labelId='order-type-select-label'
                label='Order Type'
                value={orderType}
                onChange={(event) => setOrderType(event.target.value)}
              >
                <MenuItem value={'Market'}>Market</MenuItem>
                <MenuItem value={'Limit'}>Limit</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box my={2} display={'flex'} justifyContent={'center'}>
            {currentPrice > 1.0 ? (
              <Typography variant='h5'>
                {inputVal[stock] &&
                inputVal[stock] > 0 &&
                orderType === 'Market'
                  ? `Total: $${parseFloat(
                      currentPrice * inputVal[stock]
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })}`
                  : ''}
              </Typography>
            ) : (
              <Typography variant='h5'>
                {inputVal[stock] &&
                inputVal[stock] > 0 &&
                orderType === 'Market'
                  ? `Total: $${parseFloat(currentPrice * inputVal[stock])}`
                  : ''}
              </Typography>
            )}
            {inputVal[stock] && inputVal[stock] > 0 && orderType === 'Limit' ? (
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
                  style: { textAlign: 'center' },
                  type: 'number',
                  step: '0.001',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
                id='limit-price'
                label='Limit Price'
                value={orderPrice}
                onChange={(event) => setOrderPrice(event.target.value)}
              />
            ) : (
              ''
            )}
          </Box>
          <Button
            type='submit'
            name='buy'
            sx={{ alignSelf: 'center', width: '50%' }}
          >
            Buy
          </Button>
          <Button
            type='submit'
            name='sell'
            sx={{ alignSelf: 'center', width: '50%' }}
          >
            Sell
          </Button>
        </Box>
      </Box>
      <Dialog open={alertOpen}>
        <DialogTitle>Balance too low</DialogTitle>
        <DialogContentText sx={{ ml: 2 }}>
          You do not have enough money in your account to buy the specified
          amount of shares. Would you like to deposit the required amount?
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() => onConfirm(currentPrice, inputVal[stock], stock)}
          >
            Sure!
          </Button>
          <Button
            onClick={() => {
              setAlertOpen(false);
              setInputVal({ ...inputVal, [stock]: '' });
            }}
          >
            No thanks
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BuySellForm;
