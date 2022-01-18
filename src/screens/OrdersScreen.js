import React, {useContext, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Context as OrderContext} from '../context/OrderContext'
import { DataGrid, GridOverlay, GridFooterContainer, GridFooter } from '@mui/x-data-grid';
import { IconButton, LinearProgress, Tooltip } from '@mui/material';
import moment from 'moment'
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import RefreshIcon from '@mui/icons-material/Refresh';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
            <LinearProgress />
        </div>
        </GridOverlay>
    );
}

const CustomFooter = (props) => {
    const {callback, ...rest} = props
    return (
        <GridFooterContainer>
            <Tooltip title="Refresh">
                <IconButton sx={{marginLeft:1}} onClick={callback}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
            <GridFooter {...rest}/>
        </GridFooterContainer>
    )
    
}


const OrdersScreen = () => {
    const {state:{orderList}, fetchOrders, deleteOrder} = useContext(OrderContext);
    const [loading, setLoading] = useState(false)
    const [pageSize,setPageSize] = useState(10);
    const pageOptions = [10,20,40,80,100];
    const [sortModel, setSortModel] = useState([
        {
            field: 'date',
            sort: 'desc',
        }
    ]);

    const handleRefresh = async () => {
        setLoading(true)
        await fetchOrders()
        setLoading(false)
    }

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
        const interval_id = setInterval(() => {
            fetchOrders()
        }, 60000)
        return () => clearInterval(interval_id)
    }, [JSON.stringify(orderList)])

    return (
        <>
            <NavBar />
            <DataGrid 
                autoHeight
                sx={{margingBottom:11}}
                disableSelectionOnClick
                columns={columns}
                rows={orderList}
                loading={loading}
                sortModel={sortModel}
                rowsPerPageOptions={pageOptions}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pageSize={pageSize}
                onSortModelChange={(model) => setSortModel(model)}
                getRowId={(row) => row._id}
                components={{
                    Footer: (props) => <CustomFooter callback={handleRefresh} {...props}/>,
                    LoadingOverlay: CustomLoadingOverlay
                }}
                
            />
        </>
    );
};

export default OrdersScreen;