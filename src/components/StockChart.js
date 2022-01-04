import React, {useEffect, useState, useContext} from "react";
import Plot from "react-plotly.js";
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from "@mui/material";
import {Context as StockContext} from '../context/StockContext';


const StockChart = ({ data, ticker }) => {
    const {state:{selectedIntervals}, setSelectedInterval} = useContext(StockContext)
    const theme = useTheme();
    const [dates, setDates] = useState([]);
    const [prices, setPrices] = useState([]);
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
        yaxis:{color:theme.palette.text.primary}
    });

    const getData = async () => {
        const data_interval = data[selectedIntervals[ticker]]['quotes']
        data_interval.forEach(element => {
            setDates(dates => [...dates, element.date]);
            setPrices(prices => [...prices, element.close]);
        })
    }

    useEffect(() => {
        setDates([]);
        setPrices([]);
        getData();
    }, [selectedIntervals[ticker]]);

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
        })
    }, [theme])


    return (
        <>
            <ButtonGroup sx={{paddingRight:10, alignSelf:'flex-end'}} variant="outlined">
                {intervals.map((value, index) => (
                    <Button key={value} variant={selectedIntervals[ticker] === value ? "contained" : 'outlined'} onClick={() => setSelectedInterval({ticker, interval:value})}>{value}</Button>    
                ))}
            </ButtonGroup>
            <Plot
                data={[
                    {
                        x: dates,
                        y: prices,
                        type: 'scatter',
                        mode:'lines'
                    }
                ]}
                layout={layout}
                config={{
                    displayModeBar: false
                }}
            />
        </>
        
    )
}

export default StockChart