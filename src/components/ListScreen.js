import { Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import React, { useContext, useEffect, useState } from 'react';
import {Context as StockContext} from '../context/StockContext';
import NavBar from './NavBar';
import { useTheme } from '@mui/material/styles';
import AddStock from './AddStock';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
    ))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

const ListScreen = () => {
    const {state:{stocksList, chartList}, fetchList, fetchStocks, deleteStock} = useContext(StockContext);
    const [expanded, setExpanded] = useState('');
    const theme = useTheme();

    useEffect(() => {
        if (chartList.length === 0){
            fetchStocks();
        }
        fetchList()
        const interval = setInterval(() => {
            fetchList()
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const onDeleteClick = async (ticker) => {
        await deleteStock(ticker);
    }

    return (
        <>
            <NavBar />
            <AddStock />
            {Object.entries(stocksList).map(([key, value]) => (
                <Accordion key={key} expanded={expanded === key} onChange={handleChange(key)}>
                    <AccordionSummary id={key}>
                        <Typography sx={{width:'95%', flexShrink:0}}>{`${value.price.shortName}: $${value.price.regularMarketPrice}`}</Typography>
                        <Button sx={{fontWeight:'bold', fontFamily:'Calibri', fontSize:'14.5px', padding:0}} variant="contained" size="medium" onClick={() => onDeleteClick(key)}>Delete</Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid container item xs={5.9} direction="column">
                                {chartList.find(element => element.props.id === key)}
                            </Grid>
                        </Grid>    
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default ListScreen;