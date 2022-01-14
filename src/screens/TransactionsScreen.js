import { Typography, Box } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as PortfolioContext} from '../context/PortfolioContext';
import moment from 'moment';

const columns = [
    {field: 'ticker', headerName:'Stock', flex:1},
    {field: 'quantity', headerName:'Quantity', flex:1},
    {field: 'price', headerName:'Stock Price', flex:1, valueFormatter: ({value}) => value < 1.0 ? `$${value}`: `$${value.toFixed(2)}`},
    {field: 'total', headerName: 'Spent/Gained', flex:1},
    {field:'date', headerName:'Date', flex:1, type:'dateTime', valueGetter: ({value}) => value && moment(value, 'MMMM Do YYYY, h:mm:ss a').toDate()}

]

const CustomNoRowsOverlay = () => {
    return (
        <GridOverlay>
            <Typography>You have not made a transaction</Typography>
        </GridOverlay>
    )
}

const TransactionsScreen = () => {
    const {state:{transactionList}, getTransactions} = useContext(PortfolioContext)
    const [pageSize,setPageSize] = useState(10);
    const [pageOptions, setPageOptions] = useState([10,20,40,80,100]);
    const [sortModel, setSortModel] = useState([
        {
            field: 'date',
            sort: 'desc',
        }
    ]);

    useEffect(() => {
        getTransactions();
    }, []);

    useEffect(() => {
        if(transactionList.length > 100){
            setPageOptions([...pageOptions, transactionList.length])
        }
    }, [])

    return (
        <>
            <NavBar/>
            <Box sx={{display: 'flex', height: '100%'}}>
                <Box 
                    sx={{
                        flexGrow:1,
                        '& .buy':{
                            color: 'red'
                        },
                        '& .sell': {
                            color:'green'
                        }
                    }}>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        components={{
                            NoRowsOverlay: CustomNoRowsOverlay
                        }}
                        rows={transactionList}
                        getRowId={(row) => row._id}
                        sortModel={sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                        rowsPerPageOptions={pageOptions}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        pageSize={pageSize}
                        getCellClassName={(params) => {
                            if(params.field !== 'total'){
                                return ''
                            }
                            return params.value.includes('-') ? 'buy' : 'sell'
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default TransactionsScreen;