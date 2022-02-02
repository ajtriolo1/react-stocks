import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import React, { useState } from 'react';
import AddStock from '../components/AddStock';
import NavBar from '../components/NavBar';
import WatchlistCharts from '../components/WatchlistCharts';
import WatchlistList from '../components/WatchlistList';

const WatchlistScreen = () => {
  const [display, setDisplay] = useState('chart');

  const handleChange = (event, newAlignment) => {
    setDisplay(newAlignment);
  };

  return (
    <>
      <NavBar />
      <Box display='flex' alignItems='center' marginY={'15px'} width='100%'>
        <AddStock />
        <ToggleButtonGroup
          style={{ position: 'absolute', left: '46%' }}
          value={display}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value='chart'>Charts</ToggleButton>
          <ToggleButton value='list'>List</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {display === 'chart' ? <WatchlistCharts /> : <WatchlistList />}
    </>
  );
};

export default WatchlistScreen;
