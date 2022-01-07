import React, {useState, useContext, useEffect} from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import {Context as PortfolioContext} from '../context/PortfolioContext'

const BuySellForm = ({stock, value}) => {
    const [inputVal, setInputVal] = useState({});
    const {state:{portfolio}, buyStock, sellStock, getPortfolio} = useContext(PortfolioContext);
    const currentPrice = value.price.regularMarketPrice

    useEffect(() => {
        getPortfolio();
    }, [])

    const onSubmit = async(event, price, ticker) => {
        event.preventDefault();
        const name = event.nativeEvent.submitter.name
        const data = new FormData(event.currentTarget);
        if (name === 'buy'){
            const err = await buyStock(ticker, price, parseInt(data.get('quantity')))
            if(err){
                alert(err)
            }
        }else{
            const err = await sellStock(ticker, price, parseInt(data.get('quantity')));
            if(err){
                alert('You can\'t sell more than you have!')
            }
        }
        setInputVal({...inputVal, [ticker]:''})
        getPortfolio()
    }

    return (
        <>
            {
                portfolio[stock] 
                ? <Typography alignSelf={'center'} color="green">{`You currently own ${portfolio[stock].quantity} shares of ${stock}`}</Typography> 
                : null
            }
            <Box component="form" sx={{display: 'flex', m: 'auto'}} onSubmit={(event) => onSubmit(event, currentPrice, stock)}>
                <Box sx={{display:'flex', flexDirection:'column', mb:8}}>
                    <Box my={2} display={"flex"} justifyContent={'center'}>
                        <Typography variant="h3">{`$${currentPrice}`}</Typography>
                    </Box> 
                    <TextField 
                        id="quantity" 
                        name="quantity"
                        label='Shares'
                        fullWidth
                        sx={{
                            "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": { 
                                display: 'none'
                            },
                            width:150,
                            alignSelf:'center'
                        }}
                        inputProps={{
                            min:1, 
                            style:{textAlign:'center'},
                            type: 'number'
                        }} 
                        onChange={(event) => setInputVal({...inputVal, [stock]:event.target.value})}
                        value={inputVal[stock] || ''}
                    />
                    <Box my={2} display={"flex"} justifyContent={'center'}>
                        <Typography variant="h5">
                            {inputVal[stock] && inputVal[stock] > 0 
                            ? `Total: $${parseFloat(currentPrice*inputVal[stock]).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0]}` 
                            : ''}
                        </Typography>
                    </Box> 
                    <Button type="submit" name="buy">Buy</Button>
                    <Button type="submit" name="sell">Sell</Button>
                </Box>
            </Box>
        </>
    );
};

export default BuySellForm;