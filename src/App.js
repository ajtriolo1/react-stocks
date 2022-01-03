import React, {useState} from 'react';
import './App.css';
import ChartScreen from './components/ChartScreen';
import {Provider as AuthProvider} from './context/AuthContext';
import {Provider as StockProvider} from './context/StockContext';
import ResolveAuth from './components/ResolveAuth';
import LoginScreen from './components/LoginScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupScreen from './components/SignupScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Fab } from '@mui/material';
import ListScreen from './components/ListScreen';
import AccountScreen from './components/AccountScreen';

function App() {

  const [dark, setDark] = useState(true);
  const buttonText = dark ? 'Light Mode' : 'Dark Mode'

  const theme = createTheme({
    palette:{
        mode: dark ? 'dark' : 'light',
        signout: {
          main: '#fff',
          contrastText: '#000'
        }
    }
  })

  return (
    
      <StockProvider>
        <AuthProvider>
          <Router>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path='/' element={<ResolveAuth />}/>
                <Route path='/charts' element={<ChartScreen/>}/>
                <Route path='/list' element={<ListScreen/>}/>
                <Route path='/login' element={<LoginScreen/>}/>
                <Route path='/signup' element={<SignupScreen/>}/>
                <Route path='account' element={<AccountScreen/>}/>
              </Routes>
              <Fab 
                sx={{
                  position:'fixed', 
                  bottom:20, 
                  right:20, 
                  top:'auto', 
                  left:'auto', 
                  margin:0
                  }} 
                color="primary" 
                variant='extended'
                onClick={() => setDark(!dark)}
                >
                  {buttonText}
              </Fab>
            </ThemeProvider>
          </Router>
        </AuthProvider>
      </StockProvider>
    
  );
}

export default App;
