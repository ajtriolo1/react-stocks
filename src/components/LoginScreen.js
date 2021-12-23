import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Context as AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function LoginScreen() {
    const {state:{errorMessage}, signin} = useContext(AuthContext);
    const [emailFilled, setEmailFilled] = useState(false);
    const [passFilled, setPassFilled] = useState(false);
    const [emailStarted, setEmailStarted] = useState(false);
    const [passStarted, setPassStarted] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            navigate('/charts');
        }
    }, [])
    

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        signin({email: data.get('email'), password: data.get('password')}, navigate);
    };

    return (
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    error={!emailFilled && emailStarted}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(text) => {
                        setEmailFilled(!!text.target.value.trim())
                        setEmailStarted(true)
                    }}
                    onBlur = {(text) => {
                        setEmailFilled(!!text.target.value.trim())
                        setEmailStarted(!text.target.value.trim())
                        setBtnDisabled(!text.target.value.trim())
                    }}
                    helperText={
                        emailFilled || !emailStarted
                        ? '' 
                        : 'Please enter a valid email'
                    }
                />
                <TextField
                    error={!passFilled && passStarted}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(text) => {
                        setPassFilled(!!text.target.value.trim())
                        setPassStarted(true)
                    }}
                    onBlur = {(text) => {
                        setPassFilled(!!text.target.value.trim())
                        setPassStarted(!text.target.value.trim())
                        setBtnDisabled(!text.target.value.trim())
                    }}
                    helperText={
                        passFilled || !passStarted
                        ? '' 
                        : 'Please enter your password'
                    }
                />
                {errorMessage.form ? <Typography sx={{color:'red'}} variant="body2">Incorrect email or password.</Typography> : null}
                <Button
                    type="submit"
                    fullWidth
                    disabled={btnDisabled || (!emailFilled || !passFilled)}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                    <Link href="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                    </Grid>
                </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
    );
}