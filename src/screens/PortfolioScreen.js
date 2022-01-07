import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as PortfolioContext} from '../context/PortfolioContext';
import { DataGrid } from '@mui/x-data-grid';

const gainFormatter = (params) => {
    if (params.value < 0) {
        if (Math.abs(params.value) > 0.1){
            return `-$${Math.abs(params.value).toFixed(2)}`
        }else{
            return `-$${Math.abs(params.value).toFixed(10)}`
        }  
    }else{
        if (Math.abs(params.value) > 0.1){
            return `$${Math.abs(params.value).toFixed(2)}`
        }else{
            return `$${Math.abs(params.value).toFixed(10)}`
        } 
    }
}

const columns = [
    {field: 'ticker', headerName:'Stock', flex:1},
    {field: 'currentPrice', headerName: 'Current Price', flex:1, valueFormatter: ({value}) => value > 1.0 ? `$${value.toFixed(2)}` : `$${value}`},
    {field:'quantity', headerName: 'Amount Owned', flex:1},
    {field:'currentValue', headerName:'Current Value', flex:1, valueFormatter: ({value}) => `$${value}`},
    {field:'total', headerName: 'Total Cost', flex:1, valueFormatter: ({value}) => `$${value}`},
    {field: 'gains', headerName:'Gained/Lost', flex:1, valueFormatter: gainFormatter}
]

const PortfolioScreen = () => {
    const {state:{portfolio, portfolioQuotes}, getPortfolio, getPortfolioQuotes} = useContext(PortfolioContext)
    const [data, setData] = useState([]);
    const [pageSize,setPageSize] = useState(10);
    const [pageOptions, setPageOptions] = useState([10,20,40,80,100]);
    const [sortModel, setSortModel] = useState([
        {
            field: 'ticker',
            sort: 'asc',
        }
    ]);

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
                if(portfolioQuotes[val.ticker].price.regularMarketPrice > 1.0){
                    val['gains'] = ((val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice) - (val.total)).toFixed(2)
                    val['currentValue'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice).toFixed(2)
                    val['total'] = parseFloat(val['total']).toFixed(2)
                }else{
                    val['gains'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice) - (val.total)
                    val['currentValue'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice).toFixed(10)
                    val['total'] = parseFloat(val['total']).toFixed(10)
                }
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
                    },
                    '& .zero':{
                        color:'gray'
                    }
                }} 
                autoHeight
                columns={columns}
                rows={data}
                getRowId={(row) => row._id}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                rowsPerPageOptions={pageOptions}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pageSize={pageSize}
                getCellClassName={(params) => {
                    if(params.field !== 'gains'){
                        return ''
                    }
                    if(params.value > 0){
                        return 'positive'
                    }else if (params.value < 0){
                        return 'negative'
                    }else{
                        return 'gray'
                    }
                }}
            />
        </>
    );
};

export default PortfolioScreen;