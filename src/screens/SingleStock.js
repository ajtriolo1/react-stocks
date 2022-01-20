import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router';
import { Typography, Box, Grid, CircularProgress } from '@mui/material';
import {Context as StockContext} from '../context/StockContext'
import FullscreenChart from '../components/FullscreenChart';

const SingleStock = () => {
    const params = useParams();
    const {state:{singleStock}, getSingleStock, resetSingleStock} = useContext(StockContext);

    useEffect(() => {
        resetSingleStock();
        getSingleStock(params.ticker)
    }, [params.ticker])

    return (
        <Box minHeight={'98vh'} display="flex" flexDirection="column">
            <NavBar />
            {singleStock 
                ? <FullscreenChart data={singleStock} ticker={params.ticker}/>
                : <Box sx={{display:'flex', m:'auto'}}><CircularProgress sx={{alignSelf:'center'}} /></Box>
            }
        </Box>
    );
};

export default SingleStock;