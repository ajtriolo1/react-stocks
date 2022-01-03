import { Box, Button, TextField, Typography, Slide } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import NavBar from './NavBar';
import {Context as AuthContext} from '../context/AuthContext'
import { keyframes } from '@mui/system';

const AccountScreen = () => {
    const {state:{userInfo, errorMessage}, getUserInfo, changeEmail} = useContext(AuthContext);
    const [newEmail, setNewEmail] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getUserInfo();
    }, [])

    const handleSubmit = async () => {
        await changeEmail({newEmail: newEmail});
        if (!errorMessage.form){
            setNewEmail('');
            setSuccess(true);
        }else{
            setSuccess(false)
        }
    }

    return (
        <>
            <NavBar/>
            <Box sx={{p:4}}>
                <Typography variant='h2'>{`${userInfo.firstName} ${userInfo.lastName}`}</Typography>
                <Typography variant='subtitle1'>{userInfo.email}</Typography>
            </Box>
            <Box sx={{display:'flex'}}>
                <TextField
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    sx={{m:2}}
                    margin="normal"
                    id="newEmail"
                    name="newEmail"
                    label="New Email"
                />
                <Button 
                    onClick={handleSubmit}
                    variant='contained'
                    sx={{my:2, height:40, alignSelf:'center'}}
                >
                    Change Email
                </Button>
            </Box>
            {errorMessage.form ? <Typography sx={{color:'red', ml:2}} variant="body2">Email already in use</Typography> : null}
        </>
    );
};

export default AccountScreen;