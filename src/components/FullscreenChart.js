import { Box, ButtonGroup, Button } from '@mui/material';
import React, {useState, useEffect} from 'react';
import Plot from "react-plotly.js";
import { useTheme } from '@mui/material/styles';

const FullscreenChart = ({data, ticker}) => {
    const [selectedInterval, setSelectedInterval] = useState('1d')
    const [dates, setDates] = useState([]);
    const [prices, setPrices] = useState([]);
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
        autosize:true
    });

    const getData = async () => {
        const data_interval = data[selectedInterval]['quotes']
        data_interval.forEach(element => {
            setDates(dates => [...dates, element.date]);
            setPrices(prices => [...prices, element.close]);
        })
    }

    useEffect(() => {
        setDates([]);
        setPrices([]);
        getData();
        console.log('here')
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
            autosize:true
        })
    }, [theme, ticker])

    return (
        <Box sx={{width:'auto'}} display="flex" flexDirection="column" marginTop={2} flex={1}>
            <ButtonGroup sx={{paddingRight:10, alignSelf:'flex-end'}} variant="outlined">
                {intervals.map((value, index) => (
                    // <Button key={value} variant={selectedIntervals[ticker] === value ? "contained" : 'outlined'} onClick={() => setSelectedInterval({ticker, interval:value})}>{value}</Button>    
                    <Button key={value} variant={selectedInterval === value ? "contained" : 'outlined'} onClick={() => setSelectedInterval(value)}>{value}</Button>    
                ))}
            </ButtonGroup>
            <Plot
                style={{display:'flex', width:'auto', flex:1}} 
                data={[
                    {
                        x: dates,
                        y: prices,
                        type:'scatter',
                        mode:'lines'
                    }
                ]}
                layout={layout}
                config={{
                    displayModeBar: false
                }}
            />
        </Box>
    );
};

export default FullscreenChart;