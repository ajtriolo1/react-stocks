import React, {useContext, useEffect, useState} from "react";
import {Context as StockContext} from '../context/StockContext';
import {Button, Grid} from "@mui/material";
import NavBar from "../components/NavBar";
import AddStock from "../components/AddStock";

const ChartScreen = () => {
    const {state:{chartList}, fetchStocks, deleteStock} = useContext(StockContext);

    useEffect(() => {
        if(chartList.length === 0){
            fetchStocks();
        }
    }, []);

    const onDeleteClick = async (ticker) => {
        await deleteStock(ticker);
    }

    return (
        <>
            <NavBar/>
            <AddStock />
            <Grid container spacing={2}>
                {chartList.map((chart, index) => (
                    <Grid container item xs={5.9} key={index} direction="column">
                        <Button sx={{alignSelf:'flex-end', width:5, borderRadius:20}} variant="contained" onClick={() => onDeleteClick(chart.key)}>X</Button>
                        {chart}
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default ChartScreen;