import {
  Box,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useState, useEffect, useContext } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { Context as StockContext } from '../context/StockContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import BuySellForm from './BuySellForm';

const FullscreenChart = ({ data, ticker }) => {
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const {
    state: { tickerList, singleStockQuote },
    addStock,
    deleteStock,
    getSingleStockQuote,
  } = useContext(StockContext);
  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const intervals = ['1d', '1wk', '1mo', '3mo', '1yr'];
  const [layout, setLayout] = useState({
    title: {
      text: ticker,
      font: {
        color: theme.palette.text.primary,
      },
    },
    plot_bgcolor: theme.palette.background.default,
    paper_bgcolor: theme.palette.background.paper,
    xaxis: { color: theme.palette.text.primary },
    yaxis: { color: theme.palette.text.primary },
    autosize: true,
    responsive: true,
  });

  const getData = async () => {
    const data_interval = data[selectedInterval]['quotes'];
    data_interval.forEach((element) => {
      if (selectedInterval !== '1d' && selectedInterval !== '1wk') {
        setDates((dates) => [...dates, element.date.split('T')[0]]);
      } else {
        setDates((dates) => [...dates, moment(element.date).format()]);
      }
      setPrices((prices) => [...prices, element.close]);
    });
  };

  useEffect(() => {
    getSingleStockQuote(ticker);
    if (dialogOpen) {
      getSingleStockQuote(ticker);
      const interval = setInterval(() => {
        getSingleStockQuote(ticker);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [dialogOpen]);

  useEffect(() => {
    setDates([]);
    setPrices([]);
    getData();
  }, [selectedInterval, JSON.stringify(data)]);

  useEffect(() => {
    setLayout({
      title: {
        text: ticker,
        font: {
          color: theme.palette.text.primary,
        },
      },
      plot_bgcolor: theme.palette.background.default,
      paper_bgcolor: theme.palette.background.paper,
      xaxis: { color: theme.palette.text.primary },
      yaxis: { color: theme.palette.text.primary },
      autosize: true,
      responsive: true,
    });
  }, [theme, ticker]);

  const handleAddClick = async () => {
    setLoading(true);
    await addStock(ticker);
    setLoading(false);
  };

  const handleRemoveClick = async () => {
    setLoading(true);
    await deleteStock(ticker);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const handleDialogClose = (event) => {
    setDialogOpen(false);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      flex={1}
      minHeight={0}
      width='100%'
    >
      <Box display='flex' sx={{ marginTop: '10px' }}>
        {!tickerList.includes(ticker) ? (
          <LoadingButton
            loading={loading}
            sx={{ marginLeft: 3 }}
            variant='outlined'
            onClick={handleAddClick}
            startIcon={<AddIcon />}
          >
            Watchlist
          </LoadingButton>
        ) : (
          <LoadingButton
            loading={loading}
            sx={{ marginLeft: 3 }}
            color='error'
            variant='outlined'
            onClick={handleRemoveClick}
            startIcon={<RemoveIcon />}
          >
            Watchlist
          </LoadingButton>
        )}
        <LoadingButton
          variant='outlined'
          sx={{ ml: 2 }}
          loading={dialogOpen}
          onClick={() => setDialogOpen(true)}
        >
          Buy/Sell
        </LoadingButton>
        <ButtonGroup
          variant='outlined'
          sx={{ marginLeft: 'auto', marginRight: 3 }}
        >
          {intervals.map((value, index) => (
            <Button
              key={value}
              variant={selectedInterval === value ? 'contained' : 'outlined'}
              onClick={() => setSelectedInterval(value)}
            >
              {value}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Plot
        data={[
          {
            x: dates,
            y: prices,
            type: 'scatter',
            mode: 'lines',
          },
        ]}
        style={{ height: '100%', minHeight: 0 }}
        layout={layout}
        useResizeHandler={true}
        config={{
          displayModeBar: false,
        }}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          <Box display='flex' alignItems='center'>
            <Box flexGrow={1}>{`Buy/Sell ${ticker}`}</Box>
            <Box>
              <IconButton onClick={() => setDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection={'column'} marginTop='10px'>
            <BuySellForm
              stock={ticker}
              value={singleStockQuote}
              callback={setDialogOpen}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FullscreenChart;
