import React, { useState, useContext } from 'react';
import { TextField, Box, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Context as StockContext } from '../context/StockContext';
import { toast } from 'react-toastify';

const AddStock = () => {
  const [term, setTerm] = useState('');
  const [loadingCharts, setLoadingCharts] = useState(false);
  const {
    state: { tickerList, options },
    autoComplete,
    clearOptions,
    addStock,
    fetchList,
  } = useContext(StockContext);
  const [open, setOpen] = useState(false);

  const onAddClick = async (event, term) => {
    event.preventDefault();
    setTerm('');
    if (tickerList.includes(term.toUpperCase())) {
      toast.error('This stock is already in your watchlist');
      clearOptions();
    } else if (term === '') {
      toast.error('Please enter a stock ticker symbol');
    } else {
      setLoadingCharts(true);
      const res = await toast.promise(addStock(term.toUpperCase()), {
        error: {
          render({ data }) {
            setLoadingCharts(false);
            return data;
          },
        },
      });
      if (res) {
        return;
      }
      await fetchList();
      handleScroll();
      setLoadingCharts(false);
      clearOptions();
      document.getElementById('watchlist-stock-search').blur();
    }
  };

  const handleScroll = () => {
    window.scroll({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      component='form'
      display='flex'
      position='absolute'
      left={'15px'}
      onSubmit={(event) => onAddClick(event, term)}
    >
      <Autocomplete
        id='watchlist-stock-search'
        style={{ width: '230px', marginRight: '10px' }}
        freeSolo
        disableClearable
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        filterOptions={(x) => x}
        getOptionLabel={(option) => {
          if (option.symbol) {
            return `${option.symbol} - ${option.shortname}`;
          } else {
            return option;
          }
        }}
        isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
        inputValue={term}
        value={term}
        onChange={(event, value, reason) => {
          if (reason === 'reset') {
            setTerm('');
            return;
          } else {
            if (value !== null) {
              setTerm(value.symbol);
            }
          }
        }}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          return (
            <TextField
              {...params}
              label='Ticker Symbol'
              size='small'
              variant='outlined'
              value={term}
              onChange={(event) => {
                if (event.target.value !== '' || event.target.value !== null) {
                  setTerm(event.target.value.trim());
                  autoComplete(event.target.value);
                }
              }}
            />
          );
        }}
      />
      <LoadingButton
        variant='contained'
        size='medium'
        type='submit'
        loading={loadingCharts}
      >
        Add Stock
      </LoadingButton>
    </Box>
  );
};

export default AddStock;
