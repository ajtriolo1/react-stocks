import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import moment from 'moment';

const StockChart = ({ data, ticker }) => {
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const theme = useTheme();
  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([]);
  const intervals = ['1d', '1wk', '1mo', '3mo', '1yr'];
  const shortname = data['shortname'];
  const [layout, setLayout] = useState({
    title: {
      text: `${shortname} - ${ticker}`,
      font: {
        color: theme.palette.text.primary,
      },
    },
    plot_bgcolor: theme.palette.background.default,
    paper_bgcolor: theme.palette.background.paper,
    xaxis: {
      color: theme.palette.text.primary,
      rangebreaks: [
        {
          enabled: !ticker.includes('-USD') && selectedInterval === '1wk',
          bounds: ['sat', 'mon'],
        },
        {
          enabled: !ticker.includes('-USD') && selectedInterval === '1wk',
          pattern: 'hour',
          bounds: [19, 3],
        },
      ],
    },
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
    setDates([]);
    setPrices([]);
    getData();
  }, [selectedInterval]);

  useEffect(() => {
    setLayout({
      title: {
        text: `${shortname} - ${ticker}`,
        font: {
          color: theme.palette.text.primary,
        },
      },
      plot_bgcolor: theme.palette.background.default,
      paper_bgcolor: theme.palette.background.paper,
      xaxis: {
        color: theme.palette.text.primary,
        rangebreaks: [
          {
            enabled: !ticker.includes('-USD') && selectedInterval === '1wk',
            bounds: ['sat', 'mon'],
          },
          {
            enabled: !ticker.includes('-USD') && selectedInterval === '1wk',
            pattern: 'hour',
            bounds: [19, 3],
          },
        ],
      },
      yaxis: { color: theme.palette.text.primary },
      autosize: true,
      responsive: true,
    });
  }, [theme, selectedInterval]);

  return (
    <>
      <ButtonGroup
        sx={{ paddingRight: 10, alignSelf: 'flex-end' }}
        variant='outlined'
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
      <Plot
        data={[
          {
            x: dates,
            y: prices,
            type: 'scatter',
            mode: 'lines',
            connectgaps: true,
          },
        ]}
        style={{ width: '100%' }}
        useResizeHandler={true}
        layout={layout}
        config={{
          displayModeBar: false,
        }}
      />
    </>
  );
};

export default StockChart;
