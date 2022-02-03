import { Box, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React, { useState, useContext, useEffect } from 'react';
import { Context as PortfolioContext } from '../context/PortfolioContext';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { toast } from 'react-toastify';

const PortfolioHistory = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPlot, setShowPlot] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const {
    state: { history },
    getHistorical,
  } = useContext(PortfolioContext);
  const [layout, setLayout] = useState({});

  useEffect(() => {
    setLayout({
      title: {
        text: 'Portfolio Value',
        font: {
          color: theme.palette.text.primary,
        },
      },
      plot_bgcolor: theme.palette.background.default,
      paper_bgcolor: theme.palette.background.paper,
      xaxis: {
        color: theme.palette.text.primary,
      },
      yaxis: { color: theme.palette.text.primary },
      responsive: true,
    });
  }, [theme]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (moment(data.get('start-date')).diff(moment(data.get('end-date'))) > 0) {
      toast.error('Start date must be before end date');
      return;
    }
    setLoading(true);
    await getHistorical(data.get('start-date'), data.get('end-date'));
    document.getElementById('start-date').blur();
    document.getElementById('end-date').blur();
    setLoading(false);
    setStartDate(null);
    setEndDate(null);
    setShowPlot(true);
    handleScroll();
  };

  const handleScroll = () => {
    window.scroll({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      display='flex'
      flexDirection={'column'}
      textAlign={'center'}
      alignItems={'center'}
      marginTop={'10px'}
    >
      <Typography variant='h3'>Portfolio Value Plot</Typography>
      <Box
        component='form'
        id='plot-form'
        sx={{ display: 'flex', my: '15px', alignItems: 'center' }}
        onSubmit={handleSubmit}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={startDate}
            label={'Start Date'}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField
                id='start-date'
                name='start-date'
                {...params}
                error={false}
                sx={{ mx: '10px' }}
              />
            )}
          />
          <DatePicker
            value={endDate}
            label={'End Date'}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField
                id='end-date'
                name='end-date'
                {...params}
                error={false}
              />
            )}
          />
        </LocalizationProvider>
        <LoadingButton
          loading={loading}
          type='submit'
          disabled={
            !moment(endDate, 'MM/DD/YYYY', true).isValid() ||
            !moment(startDate, 'MM/DD/YYYY', true).isValid()
          }
          variant='contained'
          sx={{ ml: '10px' }}
        >
          Plot
        </LoadingButton>
      </Box>
      {showPlot ? (
        <Plot
          data={[
            {
              x: history.dates,
              y: history.values,
              type: 'scatter',
              mode: 'lines',
            },
          ]}
          style={{ width: '1000px', height: '600px' }}
          layout={layout}
          config={{
            displayModeBar: false,
          }}
        />
      ) : null}
    </Box>
  );
};

export default PortfolioHistory;
