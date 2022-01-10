import React, {useState, useContext} from 'react';
import { Grid, TextField, Button } from '@mui/material';
import {LoadingButton} from '@mui/lab'
import { Context as StockContext } from '../context/StockContext';

const AddStock = () => {
    const [term, setTerm] = useState('');
    const [loadingCharts, setLoadingCharts] = useState(false);
    const {state:{tickerList}, addStock, fetchList} = useContext(StockContext);

    const onAddClick = async (event, term) => {
        event.preventDefault();
        setTerm('');
        if(tickerList.includes(term)){
            alert('This stock is already in your portfolio');
        }else if (term === ''){
            alert('Please enter a stock ticker symbol')
        }else{
            setLoadingCharts(true);
            await addStock(term);
            await fetchList();
            handleScroll();
            setLoadingCharts(false);
        }
    }

    const handleScroll = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0, 
            behavior: 'smooth',
        });
    }

    return (
        <Grid container component="form" onSubmit={(event) => onAddClick(event, term)}>
            <Grid item>
                <TextField
                    sx={{margin:'10px'}}
                    label="Ticker Symbol" 
                    size='small' 
                    variant="outlined" 
                    value={term} 
                    onChange={event => setTerm(event.target.value)}
                />
            </Grid>
            <Grid item alignItems="center" style={{display:'flex'}}>
                <LoadingButton
                    variant="contained" 
                    size="medium"
                    type='submit'
                    loading={loadingCharts} 
                >
                        Add Stock
                </LoadingButton>
            </Grid>
        </Grid>
    )
}

export default AddStock