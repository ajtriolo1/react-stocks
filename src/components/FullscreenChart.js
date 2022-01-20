import { Box, ButtonGroup, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, {useState, useEffect, useContext} from 'react';
import Plot from "react-plotly.js";
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import {Context as StockContext} from '../context/StockContext'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const FullscreenChart = ({data, ticker}) => {
    const [selectedInterval, setSelectedInterval] = useState('1d')
    const {state:{tickerList}, addStock, deleteStock} = useContext(StockContext)
    const [dates, setDates] = useState([]);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const intervals = ['1d', '1wk', '1mo', '3mo', '1yr'];
    const [layout, setLayout] = useState({
        title:{
            text: ticker,
            font:{
                color:theme.palette.text.primary
            } 
        },
        plot_bgcolor: theme.palette.background.default, 
        paper_bgcolor: theme.palette.background.paper, 
        xaxis:{color:theme.palette.text.primary},
        yaxis:{color:theme.palette.text.primary},
        autosize:true,
        responsive:true
    });

    const getData = async () => {
        const data_interval = data[selectedInterval]['quotes']
        data_interval.forEach(element => {
            if (selectedInterval !== '1d' && selectedInterval !== '1wk'){
                setDates(dates => [...dates, element.date.split('T')[0]])
            }else{
                setDates(dates => [...dates, moment(element.date).format()]);
            }
            setPrices(prices => [...prices, element.close]);
        })
    }

    useEffect(() => {
        setDates([]);
        setPrices([]);
        getData();
    }, [selectedInterval, JSON.stringify(data)])

    useEffect(() => {
        setLayout({
            title:{
                text: ticker,
                font:{
                    color:theme.palette.text.primary
                } 
            },
            plot_bgcolor: theme.palette.background.default, 
            paper_bgcolor: theme.palette.background.paper, 
            xaxis:{color:theme.palette.text.primary},
            yaxis:{color:theme.palette.text.primary},
            autosize:true,
            responsive: true
        })
    }, [theme, ticker])

    const handleAddClick = async() => {
        setLoading(true)
        await addStock(ticker)
        setLoading(false)
    }

    const handleRemoveClick = async() => {
        setLoading(true)
        await deleteStock(ticker)
        setTimeout(() => {
            setLoading(false)
        }, 200)
        
    }

    return (
            <Box sx={{width:'100%', mt:3}}>
                <Box display="flex">
                    {!tickerList.includes(ticker) 
                        ? <LoadingButton loading={loading} sx={{marginRight:'auto', marginLeft:3}} variant="outlined" onClick={handleAddClick} startIcon={<AddIcon/>}>Watchlist</LoadingButton>
                        : <LoadingButton loading={loading} sx={{marginRight:'auto', marginLeft:3}} color="error" variant="outlined" onClick={handleRemoveClick} startIcon={<RemoveIcon/>}>Watchlist</LoadingButton>
                    }
                    <ButtonGroup variant="outlined" sx={{marginLeft:'auto', marginRight:3}}>
                        {intervals.map((value, index) => (
                            <Button key={value} variant={selectedInterval === value ? "contained" : 'outlined'} onClick={() => setSelectedInterval(value)}>{value}</Button>    
                        ))}
                    </ButtonGroup>
                </Box>
                <Plot
                    style={{width:'100%', height: '86.5vh'}} 
                    data={[
                        {
                            x: dates,
                            y: prices,
                            type:'scatter',
                            mode:'lines'
                        }
                    ]}
                    layout={layout}
                    useResizeHandler={true}
                    config={{
                        displayModeBar: false
                    }}
                />
            </Box>
    );
};

export default FullscreenChart;