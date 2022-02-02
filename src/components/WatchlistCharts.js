import React, { useContext, useEffect } from 'react';
import { Context as StockContext } from '../context/StockContext';
import { Box, CircularProgress, Grid, IconButton } from '@mui/material';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const WatchlistCharts = () => {
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
    <Box display='flex' flex={1} flexDirection={'column'}>
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

export default WatchlistCharts;