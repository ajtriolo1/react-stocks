import React, { useContext, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { Context as StockContext } from '../context/StockContext';
import FullscreenChart from '../components/FullscreenChart';

const SingleStock = () => {
  const params = useParams();
  const {
    state: { singleStockHistorical },
    getSingleStockHistorical,
    resetSingleStock,
    fetchList,
  } = useContext(StockContext);

  useEffect(() => {
    resetSingleStock();
    fetchList();
    getSingleStockHistorical(params.ticker);
  }, [params.ticker]);

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <NavBar id='single-stock-navbar' />
      {singleStockHistorical ? (
        <Box display='flex' flexDirection='column' flex={1} minHeight={0}>
          <FullscreenChart
            data={singleStockHistorical}
            ticker={params.ticker}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', m: 'auto' }}>
          <CircularProgress sx={{ alignSelf: 'center' }} />
        </Box>
      )}
    </Box>
  );
};

export default SingleStock;
