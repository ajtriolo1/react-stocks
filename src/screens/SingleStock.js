import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useLocation, useParams } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { Context as StockContext } from '../context/StockContext';
import FullscreenChart from '../components/FullscreenChart';

const SingleStock = () => {
  const params = useParams();
  const { state } = useLocation();
  const { shortname } = state;
  const {
    state: { singleStockHistorical },
    getSingleStockHistorical,
    resetSingleStock,
    fetchList,
  } = useContext(StockContext);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    if (!singleStockHistorical) {
      getSingleStockHistorical(params.ticker);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
    fetchList();
  }, [params.ticker]);

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <NavBar id='single-stock-navbar' />
      {singleStockHistorical && !loading ? (
        <Box display='flex' flexDirection='column' flex={1} minHeight={0}>
          <FullscreenChart
            data={singleStockHistorical}
            ticker={params.ticker}
            shortname={shortname}
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
