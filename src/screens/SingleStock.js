import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router';
import { Typography, Box, Grid, CircularProgress, Button, Divider } from '@mui/material';
import {Context as StockContext} from '../context/StockContext'
import FullscreenChart from '../components/FullscreenChart';
import BuySellForm from '../components/BuySellForm'

const SingleStock = () => {
    const params = useParams();
    const {state:{singleStockHistorical, singleStockQuote}, getSingleStockHistorical, getSingleStockQuote, resetSingleStock, fetchList} = useContext(StockContext);

    useEffect(() => {
        resetSingleStock();
        fetchList();
        getSingleStockHistorical(params.ticker)
        getSingleStockQuote(params.ticker)
        const interval = setInterval(() => {
            getSingleStockQuote(params.ticker)
        }, 60000)

        return () => clearInterval(interval);

    }, [params.ticker])

    return (
        <Box minHeight='100vh'>
            <NavBar id="single-stock-navbar"/>
            {singleStockHistorical && singleStockQuote
                ?
                <Grid container >
                    <Grid container item xs={9}>
                        <FullscreenChart data={singleStockHistorical} ticker={params.ticker}/>
                    </Grid>
                    <Divider orientation="vertical" flexItem style={{marginRight:"-1px"}} />
                    <Grid container item xs direction="column" sx={{m:'auto'}}>
                        <BuySellForm stock={params.ticker} value={singleStockQuote}/>
                    </Grid>
                </Grid>
                : <Box sx={{display:'flex', m:'auto'}}><CircularProgress sx={{alignSelf:'center'}} /></Box>
            }
        </Box>
    );
};

export default SingleStock;