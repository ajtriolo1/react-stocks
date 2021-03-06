import {
  Box,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import React, { useContext, useEffect, useState } from 'react';
import { Context as StockContext } from '../context/StockContext';
import BuySellForm from './BuySellForm';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';

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
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ alignSelf: 'center', fontSize: '0.9rem' }}
      />
    }
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

const WatchlistList = () => {
  const {
    state: { stocksList, chartList },
    fetchList,
    fetchStocks,
    deleteStock,
  } = useContext(StockContext);
  const [expanded, setExpanded] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (chartList.length === 0) {
      fetchStocks();
    }
    if (Object.entries(stocksList).length === 0) {
      setLoading(true);
      await fetchList();
      setLoading(false);
    }
    fetchList();
    const interval = setInterval(() => {
      fetchList();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const onDeleteClick = async (event, ticker) => {
    event.stopPropagation();
    await deleteStock(ticker);
  };

  return (
    <Box display='flex' flex={1} flexDirection='column'>
      {loading ? (
        <Box display='flex' margin='auto'>
          <CircularProgress sx={{ mb: 20 }} />
        </Box>
      ) : Object.entries(stocksList).length === 0 ? (
        <Box display='flex' flexDirection={'column'} margin='auto'>
          <Typography sx={{ textAlign: 'center', mb: 2 }}>
            You don't have any stocks in your watchlist.
          </Typography>
          <Typography sx={{ mb: 20, textAlign: 'center' }}>
            You can add some by entering a ticker symbol in the top left.
          </Typography>
        </Box>
      ) : (
        <Box>
          {Object.entries(stocksList).map(([key, value]) => (
            <Accordion
              key={key}
              expanded={expanded === key}
              onChange={handleChange(key)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary sx={{ height: '60px' }} id={key}>
                <Typography
                  sx={{
                    width: '97%',
                    flexShrink: 0,
                    alignSelf: 'center',
                    mt: '1px',
                  }}
                >
                  {value.price.regularMarketPrice > 1.0
                    ? `${
                        value.price.shortName
                      }: $${value.price.regularMarketPrice.toLocaleString(
                        'en-US',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 3,
                        }
                      )}`
                    : `${value.price.shortName}: $${value.price.regularMarketPrice}`}
                </Typography>
                <IconButton
                  sx={{ alignSelf: 'center' }}
                  onClick={(event) => onDeleteClick(event, key)}
                >
                  <RemoveCircleOutlineSharpIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid container spacing={0}>
                  <Grid container item xs={12} lg={6} direction='column'>
                    {chartList.find((element) => element.props.id === key)}
                  </Grid>
                  <Grid container item xs={12} lg={6} direction='column'>
                    <BuySellForm stock={key} value={value} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WatchlistList;
