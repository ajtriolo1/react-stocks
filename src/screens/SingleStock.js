import React, { useContext, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { Context as StockContext } from '../context/StockContext';
import FullscreenChart from '../components/FullscreenChart';
import { useNavigate } from 'react-router';

const SingleStock = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    state: { singleStockHistorical },
    getSingleStockHistorical,
    resetSingleStock,
    fetchList,
  } = useContext(StockContext);

  useEffect(async () => {
    resetSingleStock();
    const err = await getSingleStockHistorical(params.ticker);
    if (err) {
      alert(err);
      return navigate(-1);
    }
    fetchList();
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
