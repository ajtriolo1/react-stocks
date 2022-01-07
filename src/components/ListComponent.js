import React, {useContext, useState} from 'react';
import { Typography, Grid, Button } from '@mui/material';
import {Context as StockContext} from '../context/StockContext'
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import BuySellForm from './BuySellForm';
import { styled } from '@mui/material/styles';

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

const ListComponent = ({stock, value, type}) => {
    const [expanded, setExpanded] = useState('');
    const {state:{chartList}, deleteStock} = useContext(StockContext);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const onDeleteClick = async (ticker) => {
        setExpanded('')
        await deleteStock(ticker);
    }

    return (
        <Accordion key={stock} expanded={expanded === stock} onChange={handleChange(stock)}>
            { type === 'list' 
            ? <AccordionSummary id={stock}>
                <Typography sx={{width:'95%', flexShrink:0}}>{`${value.price.shortName}: $${value.price.regularMarketPrice}`}</Typography>
                <Button sx={{fontFamily:'Calibri', fontSize:'14.5px', padding:0}} variant="contained" size="medium" onClick={() => onDeleteClick(stock)}>Delete</Button>
            </AccordionSummary>
            : <AccordionSummary id={stock}>
                <Typography sx={{width:'95%', flexShrink:0}}>{`${value.ticker}: $${value.total}`}</Typography>
            </AccordionSummary>
            }
            <AccordionDetails sx={{display: 'flex', flexDirection:'column'}}>
                <Grid container spacing={1}>
                    <Grid container item xs={5.9} direction="column">
                        {chartList.find(element => element.props.id === stock)}
                    </Grid>
                    <Grid container item xs={5.9} direction="column">
                        {type==='list' ? <BuySellForm stock={stock} value={value}/> : null}
                    </Grid>
                </Grid>   
            </AccordionDetails>
        </Accordion>
    );
};

export default ListComponent;