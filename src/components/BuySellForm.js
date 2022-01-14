import React, {useState, useContext, useEffect} from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, InputAdornment, FormControl, InputLabel } from '@mui/material';
import {Context as PortfolioContext} from '../context/PortfolioContext'
import {Context as OrderContext} from '../context/OrderContext'

const BuySellForm = ({stock, value, callback}) => {
    const [inputVal, setInputVal] = useState({});
    const [orderType, setOrderType] = useState('Market');
    const {state:{portfolio}, buyStock, sellStock, getPortfolio} = useContext(PortfolioContext);
    const {addOrder} = useContext(OrderContext);
    const [orderPrice, setOrderPrice] = useState('');
    const currentPrice = value.price.regularMarketPrice

    useEffect(() => {
        getPortfolio();
    }, [])

    const onSubmit = async(event, price, ticker) => {
        event.preventDefault();
        const name = event.nativeEvent.submitter.name
        const data = new FormData(event.currentTarget);
        if(orderType === 'Market'){
            if (name === 'buy'){
                const err = await buyStock(ticker, price, parseInt(data.get('quantity')))
                if(err){
                    return alert(err)
                }
            }else{
                const err = await sellStock(ticker, price, parseInt(data.get('quantity')));
                if(err){
                    setInputVal({...inputVal, [ticker]:''})
                    return alert(err)
                }
            }
        }else{
            const err = await addOrder(ticker, orderPrice, parseInt(data.get('quantity')), orderType, name)
            if(err){
                return alert(err)
            }
        }
        setInputVal({...inputVal, [ticker]:''})
        setOrderType('Market')
        setOrderPrice('');
        getPortfolio()
        if(callback){
            callback(false)
        }
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
                        <Typography variant="h3">{currentPrice > 1.0 ? `$${currentPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 3})}` : `$${currentPrice}`}</Typography>
                    </Box> 
                    <Box display="flex" marginBottom={1} gap={2}>
                        <TextField 
                            id="quantity" 
                            name="quantity"
                            label='Shares'
                            fullWidth
                            sx={{
                                "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": { 
                                    display: 'none'
                                },
                                width: '50%',
                            }}
                            inputProps={{
                                min:1, 
                                style:{textAlign:'center'},
                                type: 'number'
                            }} 
                            onChange={(event) => setInputVal({...inputVal, [stock]:event.target.value})}
                            value={inputVal[stock] || ''}
                        />
                        <FormControl sx={{width:'50%'}}>
                            <InputLabel id="order-type-select-label">
                                Order Type
                            </InputLabel>
                            <Select labelId="order-type-select-label" label="Order Type" value={orderType} onChange={(event) => setOrderType(event.target.value)}>
                                <MenuItem value={"Market"}>Market</MenuItem>
                                <MenuItem value={"Limit"}>Limit</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box my={2} display={"flex"} justifyContent={'center'}>
                        {currentPrice > 1.0 
                        ? <Typography variant="h5">
                            {inputVal[stock] && inputVal[stock] > 0 && orderType === 'Market'
                            ? `Total: $${parseFloat(currentPrice*inputVal[stock]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 3})}` 
                            : ''}
                        </Typography>
                        : <Typography variant="h5">
                            {inputVal[stock] && inputVal[stock] > 0 && orderType === 'Market'
                            ? `Total: $${parseFloat(currentPrice*inputVal[stock])}` 
                            : ''}
                        </Typography>
                        }
                        {inputVal[stock] && inputVal[stock] > 0 && orderType === 'Limit'
                        ? <TextField
                            sx={{
                                "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": { 
                                    display: 'none'
                                },
                                flexShrink:0
                            }}
                            inputProps={{
                                min:0, 
                                style:{textAlign:'center'},
                                type: 'number'
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            id='limit-price' 
                            label="Limit Price" 
                            value={orderPrice}
                            onChange={(event) => setOrderPrice(event.target.value)}
                        />
                        : ''
                        }
                    </Box>
                    <Button type="submit" name="buy">Buy</Button>
                    <Button type="submit" name="sell">Sell</Button>
                </Box>
            </Box>
        </>
    );
};

export default BuySellForm;