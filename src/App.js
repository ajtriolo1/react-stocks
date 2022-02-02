import React, { useState } from 'react';
import './App.css';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as StockProvider } from './context/StockContext';
import { Provider as PortfolioProvider } from './context/PortfolioContext';
import { Provider as OrderProvider } from './context/OrderContext';
import ResolveAuth from './components/ResolveAuth';
import LoginScreen from './screens/LoginScreen';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SignupScreen from './screens/SignupScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Fab } from '@mui/material';
import AccountScreen from './screens/AccountScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import OrdersScreen from './screens/OrdersScreen';
import SingleStock from './screens/SingleStock';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WatchlistScreen from './screens/WatchlistScreen';

function App() {
  const [dark, setDark] = useState(true);
  const buttonText = dark ? 'Light Mode' : 'Dark Mode';

  const theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      search: {
        main: '#424242',
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
                <ToastContainer
                  position='bottom-left'
                  autoClose={3000}
                  hideProgressBar={true}
                  closeButton={false}
                  theme={'colored'}
                  style={{ display: 'flex', width: 'auto' }}
                />
                <Routes>
                  <Route path='/' element={<ResolveAuth />} />
                  <Route
                    path='/watchlist'
                    element={
                      <ResolveAuth>
                        <WatchlistScreen />
                      </ResolveAuth>
                    }
                  />
                  <Route path='/login' element={<LoginScreen />} />
                  <Route path='/signup' element={<SignupScreen />} />
                  <Route
                    path='account'
                    element={
                      <ResolveAuth>
                        <AccountScreen />
                      </ResolveAuth>
                    }
                  />
                  <Route
                    path='/transactions'
                    element={
                      <ResolveAuth>
                        <TransactionsScreen />
                      </ResolveAuth>
                    }
                  />
                  <Route
                    path='/portfolio'
                    element={
                      <ResolveAuth>
                        <PortfolioScreen />
                      </ResolveAuth>
                    }
                  />
                  <Route
                    path='/orders'
                    element={
                      <ResolveAuth>
                        <OrdersScreen />
                      </ResolveAuth>
                    }
                  />
                  <Route
                    path='stock/:ticker'
                    element={
                      <ResolveAuth>
                        <SingleStock />
                      </ResolveAuth>
                    }
                  />
                  <Route path='*' element={<Navigate to='/' />} />
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
