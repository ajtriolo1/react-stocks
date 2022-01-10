import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as PortfolioContext} from '../context/PortfolioContext';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import {Typography, Dialog, DialogTitle, DialogContent, Box, IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import BuySellForm from '../components/BuySellForm'

const gainFormatter = (params) => {
    if (params.value < 0) {
        if (Math.abs(params.value) > 0.01){
            return `-$${Math.abs(params.value).toLocaleString('en-US')}`
        }else{
            return `-$${Math.abs(params.value).toFixed(10)}`
        }  
    }else if (params.value > 0){
        if (params.value > 0.01){
            return `$${params.value.toLocaleString('en-US')}`
        }else{
            return `$${params.value.toFixed(10)}`
        }
    }else{
        return `$0.00`
    }
}

const columns = [
    {field: 'ticker', headerName:'Stock', flex:1},
    {field: 'currentPrice', headerName: 'Current Price', flex:1, valueFormatter: ({value}) => value > 1.0 ? `$${value.toLocaleString('en-US')}` : `$${value}`},
    {field:'quantity', headerName: 'Amount Owned', flex:1, valueFormatter: ({value}) => value.toLocaleString('en-US')},
    {field:'currentValue', headerName:'Current Value', flex:1, valueFormatter: ({value}) => value > 1.0 ? `$${value.toLocaleString('en-US')}` : `$${value}`},
    {field:'total', headerName: 'Total Cost', flex:1, valueFormatter: ({value}) => value > 1.0 ? `$${value.toLocaleString('en-US')}` : `$${value}`},
    {field: 'gains', headerName:'Gained/Lost', flex:1, valueFormatter: gainFormatter}
]

const CustomNoRowsOverlay = () => {
    return (
        <GridOverlay>
            <Typography>You have no stocks in your portfolio</Typography>
        </GridOverlay>
    )
}

const PortfolioScreen = () => {
    const {state:{portfolio, portfolioQuotes}, getPortfolio, getPortfolioQuotes} = useContext(PortfolioContext)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stockOpen, setStockOpen] = useState('');
    const [openStockValue, setOpenStockValue] = useState({})
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
        console.log('here')
        let vals = Object.values(portfolio)
        vals.forEach((val) => {
            if(portfolioQuotes[val.ticker]){
                if(portfolioQuotes[val.ticker].price.regularMarketPrice > 1.0){
                    val['gains'] = ((val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice) - (val.total))
                    val['currentValue'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice)
                    val['total'] = parseFloat(val['total'])
                }else{
                    val['gains'] = ((val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice) - (val.total))
                    val['currentValue'] = (val.quantity*portfolioQuotes[val.ticker].price.regularMarketPrice)
                    val['total'] = parseFloat(val['total'])
                }
                val['currentPrice'] = portfolioQuotes[val.ticker].price.regularMarketPrice
            }
        })
        setData(vals)
    }, [JSON.stringify(portfolioQuotes), JSON.stringify(portfolio)])

    const handleRowClick = (event) => {
        setDialogOpen(true)
        setStockOpen(event.row.ticker)
        setOpenStockValue(portfolioQuotes[event.row.ticker])
    }

    const handleDialogClose = (event) => {
        setDialogOpen(false)
        setStockOpen('')
        setOpenStockValue({})
    }

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
                components={{
                    NoRowsOverlay: CustomNoRowsOverlay
                }}
                disableSelectionOnClick
                getRowId={(row) => row._id}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                rowsPerPageOptions={pageOptions}
                onRowClick={handleRowClick}
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
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{`Buy More ${stockOpen}`}</Box>
                        <Box>
                            <IconButton onClick={() => setDialogOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>    
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection={"column"} marginTop="10px">
                        <BuySellForm stock={stockOpen} value={openStockValue} callback={setDialogOpen}/>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PortfolioScreen;