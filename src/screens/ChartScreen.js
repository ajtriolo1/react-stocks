import React, { useContext, useEffect, useState } from 'react';
import { Context as StockContext } from '../context/StockContext';
import { Box, CircularProgress, Grid, IconButton } from '@mui/material';
import NavBar from '../components/NavBar';
import AddStock from '../components/AddStock';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const ChartScreen = () => {
  const {
    state: { chartList },
    fetchStocks,
    deleteStock,
  } = useContext(StockContext);

  useEffect(() => {
    if (chartList.length === 0) {
      fetchStocks();
    }
  }, []);

  const onDeleteClick = async (ticker) => {
    await deleteStock(ticker);
  };

  return (
    <Box display='flex' minHeight='100vh' flexDirection={'column'}>
      <NavBar />
      <AddStock />
      {chartList.length === 0 ? (
        <Box display='flex' sx={{ m: 'auto' }}>
          <CircularProgress sx={{ alignSelf: 'center' }} />
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

export default ChartScreen;
