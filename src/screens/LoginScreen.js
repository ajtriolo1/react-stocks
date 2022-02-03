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
import { Context as AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://github.com/ajtriolo1'>
        Anthony Triolo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function LoginScreen() {
  const {
    state: { errorMessage },
    signin,
  } = useContext(AuthContext);
  const [emailStarted, setEmailStarted] = useState(false);
  const [passStarted, setPassStarted] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/watchlist', { replace: true });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signin(
      { email: data.get('email'), password: data.get('password') },
      navigate
    );
  };

  return (
    <Container component='main' maxWidth='xs'>
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
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            error={emailValue.length === 0 && emailStarted}
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            value={emailValue}
            onChange={(event) => {
              setEmailValue(event.target.value);
              setEmailStarted(true);
            }}
            helperText={
              emailValue.length !== 0 || !emailStarted
                ? ''
                : 'Please enter a valid email'
            }
          />
          <TextField
            error={passwordValue.length === 0 && passStarted}
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            value={passwordValue}
            onChange={(event) => {
              setPasswordValue(event.target.value);
              setPassStarted(true);
            }}
            helperText={
              passwordValue.length !== 0 || !passStarted
                ? ''
                : 'Please enter your password'
            }
          />
          {errorMessage.form ? (
            <Typography sx={{ color: 'red' }} variant='body2'>
              Incorrect email or password.
            </Typography>
          ) : null}
          <Button
            type='submit'
            fullWidth
            disabled={emailValue.length === 0 || passwordValue.length === 0}
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href='/signup' variant='body2'>
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
