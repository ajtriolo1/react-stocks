import React, { useContext, useEffect, useState } from 'react';
import { Context as StockContext } from '../context/StockContext';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const WatchlistCharts = () => {
  const {
    state: { loadedCharts, chartList },
    fetchStocks,
    deleteStock,
  } = useContext(StockContext);

  useEffect(async () => {
    if (chartList.length === 0) {
      fetchStocks();
    }
  }, []);

  const onDeleteClick = async (ticker) => {
    await deleteStock(ticker);
  };

  return (
    <Box display='flex' flex={1} flexDirection={'column'}>
      {!loadedCharts ? (
        <Box display='flex' sx={{ m: 'auto' }}>
          <CircularProgress sx={{ alignSelf: 'center' }} />
        </Box>
      ) : chartList.length === 0 ? (
        <Box display='flex' flexDirection={'column'} margin='auto'>
          <Typography sx={{ textAlign: 'center', mb: 2 }}>
            You don't have any stocks in your watchlist.
          </Typography>
          <Typography sx={{ mb: 20, textAlign: 'center' }}>
            You can add some by entering a ticker symbol in the top left.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {chartList.map((chart, index) => (
            <Grid
              container
              item
              xs={12}
              lg={5.9}
              key={index}
              direction='column'
            >
              <IconButton
                sx={{ alignSelf: 'flex-end' }}
                color='primary'
                onClick={() => onDeleteClick(chart.key)}
              >
                <CancelSharpIcon fontSize='large' />
              </IconButton>
              {chart}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WatchlistCharts;
