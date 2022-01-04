import { Box, Button, TextField, Typography, Fade } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
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
        const err = await changeEmail({newEmail: newEmail})
        setNewEmail('');
        if(!err){
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 1000)
        }else{
            setSuccess(false);
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
                <Fade
                    in={success}
                    timeout={{
                        enter: 500,
                        exit: 500 
                    }}
                    unmountOnExit
                >
                    <Typography sx={{alignSelf:'center', color:'green', ml:2}}>Successfully Changed Email</Typography>
                </Fade>
                {errorMessage.form ? <Typography sx={{alignSelf:'center', color:'red', ml:2}} variant="body2">Email already in use</Typography> : null}
            </Box>
        </>
    );
};

export default AccountScreen;