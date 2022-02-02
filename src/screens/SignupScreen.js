import React, { useContext, useState, useEffect } from 'react';
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
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignupScreen() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstFilled, setFirstFilled] = useState(false);
  const [firstStarted, setFirstStarted] = useState(false);
  const [lastFilled, setLastFilled] = useState(false);
  const [lastStarted, setLastStarted] = useState(false);
  const [emailFilled, setEmailFilled] = useState(false);
  const [emailStarted, setEmailStarted] = useState(false);
  const [passFilled, setPassFilled] = useState(false);
  const [passStarted, setPassStarted] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/watchlist', { replace: true });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signup(
      {
        email: data.get('email'),
        password: data.get('password'),
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
      },
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
          Sign up
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!firstFilled && firstStarted}
                autoComplete='given-name'
                name='firstName'
                required
                fullWidth
                id='firstName'
                label='First Name'
                onChange={(text) => {
                  setFirstFilled(!!text.target.value.trim());
                  setFirstStarted(true);
                }}
                onBlur={(text) => {
                  setFirstFilled(!!text.target.value.trim());
                  setFirstStarted(!text.target.value.trim());
                  setBtnDisabled(!text.target.value.trim());
                }}
                helperText={
                  firstFilled || !firstStarted ? '' : 'Invalid first name'
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!lastFilled && lastStarted}
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='family-name'
                onChange={(text) => {
                  setLastFilled(!!text.target.value.trim());
                  setLastStarted(true);
                }}
                onBlur={(text) => {
                  setLastFilled(!!text.target.value.trim());
                  setLastStarted(!text.target.value.trim());
                  setBtnDisabled(!text.target.value.trim());
                }}
                helperText={
                  lastFilled || !lastStarted ? '' : 'Invalid last name'
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!emailFilled && emailStarted}
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                onChange={(text) => {
                  setEmailFilled(!!text.target.value.trim());
                  setEmailStarted(true);
                }}
                onBlur={(text) => {
                  setEmailFilled(!!text.target.value.trim());
                  setEmailStarted(!text.target.value.trim());
                  setBtnDisabled(!text.target.value.trim());
                }}
                helperText={emailFilled || !emailStarted ? '' : 'Invalid email'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!passFilled && passStarted}
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                onChange={(text) => {
                  setPassFilled(!!text.target.value.trim());
                  setPassStarted(true);
                }}
                onBlur={(text) => {
                  setPassFilled(!!text.target.value.trim());
                  setPassStarted(!text.target.value.trim());
                  setBtnDisabled(!text.target.value.trim());
                }}
                helperText={
                  passFilled || !passStarted ? '' : 'Invalid password'
                }
              />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={
              btnDisabled ||
              !firstFilled ||
              !lastFilled ||
              !emailFilled ||
              !passFilled
            }
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
