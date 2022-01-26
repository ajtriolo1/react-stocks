import React, { useState } from 'react';
import './App.css';
import ChartScreen from './screens/ChartScreen';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as StockProvider } from './context/StockContext';
import { Provider as PortfolioProvider } from './context/PortfolioContext';
import { Provider as OrderProvider } from './context/OrderContext';
import ResolveAuth from './components/ResolveAuth';
import LoginScreen from './screens/LoginScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupScreen from './screens/SignupScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Fab } from '@mui/material';
import ListScreen from './screens/ListScreen';
import AccountScreen from './screens/AccountScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import OrdersScreen from './screens/OrdersScreen';
import SingleStock from './screens/SingleStock';
import LightModeIcon from '@mui/icons-material/LightMode';

function App() {
  const [dark, setDark] = useState(true);
  const buttonText = dark ? 'Light Mode' : 'Dark Mode';

  const theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      signout: {
        main: '#fff',
        contrastText: '#000',
      },
    },
  });

  return (
    <StockProvider>
      <AuthProvider>
        <PortfolioProvider>
          <OrderProvider>
            <Router>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                  <Route path='/' element={<ResolveAuth />} />
                  <Route path='/charts' element={<ChartScreen />} />
                  <Route path='/list' element={<ListScreen />} />
                  <Route path='/login' element={<LoginScreen />} />
                  <Route path='/signup' element={<SignupScreen />} />
                  <Route path='account' element={<AccountScreen />} />
                  <Route
                    path='/transactions'
                    element={<TransactionsScreen />}
                  />
                  <Route path='/portfolio' element={<PortfolioScreen />} />
                  <Route path='/orders' element={<OrdersScreen />} />
                  <Route path='stock/:ticker' element={<SingleStock />} />
                </Routes>
                <Fab
                  sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    top: 'auto',
                    left: 'auto',
                    margin: 0,
                  }}
                  color='primary'
                  size='medium'
                  variant='contained'
                  onClick={() => setDark(!dark)}
                >
                  <LightModeIcon />
                </Fab>
              </ThemeProvider>
            </Router>
          </OrderProvider>
        </PortfolioProvider>
      </AuthProvider>
    </StockProvider>
  );
}

export default App;
