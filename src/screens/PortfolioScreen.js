import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as StockContext} from '../context/StockContext';
import {Context as PortfolioContext} from '../context/PortfolioContext';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {field: 'ticker', headerName:'Stock', flex:1},
    {field: 'currentPrice', headerName: 'Current Price', flex:1, valueFormatter: ({value}) => `$${parseFloat(value).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0]}`},
    {field:'quantity', headerName: 'Amount Owned', flex:1},
    {field: 'ROI', headerName:'ROI', flex:1, valueFormatter: ({value}) => value < 0 ? `-$${parseFloat(Math.abs(value)).toFixed(20).match(/^\d*\.?0*\d{0,2}/)[0]}`: `$${parseFloat(Math.abs(value)).toFixed(20).match(/^\d*\.?0*\d{0,2}/)[0]}`}
]

const PortfolioScreen = () => {
    const {state:{portfolio, portfolioQuotes, loadingQuotes}, getPortfolio, getPortfolioQuotes} = useContext(PortfolioContext)
    const [data, setData] = useState([]);

    useEffect(() => {
        getPortfolio();
        getPortfolioQuotes();
        const interval_id = setInterval(() => {
            getPortfolioQuotes()
        }, 60000)

        return () => clearInterval(interval_id)
    }, [])

    useEffect(() => {
        let vals = Object.values(portfolio)
        vals.forEach((val) => {
            if(portfolioQuotes[val.ticker]){
                val['ROI'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice) - (val.total)
                val['currentPrice'] = portfolioQuotes[val.ticker].price.regularMarketPrice
            }
        })
        setData(vals)
    }, [JSON.stringify(portfolioQuotes)])

    return (
        <>
            <NavBar />
            <DataGrid
                sx={{
                    '& .negative':{
                        color: 'red'
                    },
                    '& .positive': {
                        color:'green'
                    }
                }} 
                autoHeight
                columns={columns}
                rows={data}
                getRowId={(row) => row._id}
                getCellClassName={(params) => {
                    if(params.field !== 'ROI'){
                        return ''
                    }
                    return params.value < 0 ? 'negative' : 'positive'
                }}
            />
        </>
    );
};

export default PortfolioScreen;