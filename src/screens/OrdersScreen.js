import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as OrderContext} from '../context/OrderContext'
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import moment from 'moment'
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const OrdersScreen = () => {
    const {state:{orderList}, fetchOrders, deleteOrder} = useContext(OrderContext);
    const [sortModel, setSortModel] = useState([
        {
            field: 'date',
            sort: 'desc',
        }
    ]);

    const columns = [
        {field: 'ticker', headerName: 'Stock', flex:1},
        {field: 'price', headerName: 'Price', flex:1, valueFormatter: ({value}) => `$${parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 3})}`},
        {field: 'quantity', headerName:'Quantity', flex:1},
        {field: 'order_type', headerName:'Order Type', flex:1,valueFormatter: ({value}) => capitalizeFirstLetter(value)},
        {field: 'buy_sell', headerName:'Buy/Sell', flex:1, valueFormatter: ({value}) => capitalizeFirstLetter(value)},
        {field: 'date', headerName:'Date', type:'dateTime', flex:1, valueGetter: ({value}) => value && moment(value, 'MMMM Do YYYY, h:mm:ss a').toDate()},
        {field: 'action', headerName:'', renderCell: (order) => (
            <IconButton onClick={() => deleteOrder(order.id)}>
                <RemoveCircleOutlineSharpIcon />
            </IconButton>
        )}
    ]

    useEffect(() => {
        fetchOrders()
    }, [JSON.stringify(orderList)])

    return (
        <>
            <NavBar />
            <DataGrid 
                autoHeight
                disableSelectionOnClick
                columns={columns}
                rows={orderList}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                getRowId={(row) => row._id}
                
            />
        </>
    );
};

export default OrdersScreen;