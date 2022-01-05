import { Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as PortfolioContext} from '../context/PortfolioContext';

const columns = [
    {field: 'ticker', headerName:'Stock', flex:1},
    {field: 'quantity', headerName:'Quantity', flex:1},
    {field: 'price', headerName:'Stock Price', flex:1},
    {field: 'total', headerName: 'Spent/Recieved', flex:1},
    {field:'transaction_type', headerName:'Buy/Sell', flex:1},
    {field:'date', headerName:'Date', flex:1}

]

const TransactionsScreen = () => {
    const {state:{transactionList}, getTransactions} = useContext(PortfolioContext)
    const [sortModel, setSortModel] = useState([
        {
            field: 'date',
            sort: 'desc',
        }
    ]);

    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <>
            <NavBar/>
            <Box sx={{display: 'flex', height: '100%'}}>
                <Box sx={{flexGrow:1}}>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={transactionList}
                        getRowId={(row) => row._id}
                        sortModel={sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                    />
                </Box>
            </Box>
        </>
    );
};

export default TransactionsScreen;