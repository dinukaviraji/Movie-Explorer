// src/components/LoginModal.jsx
import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import SigninModal from './SigninModal';
import { useState } from 'react';

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const LoginModal = ({ open, onClose }) => {
    const [signinOpen, setSigninOpen] = useState(false);


return (
    <>
        <Modal
            open={open}
            onClose={onClose}
            // aria-labelledby="login-title"
            // aria-describedby="login-description"
            BackdropProps={{
                sx: {
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            <Box sx={style}>
                <Typography variant="h6" fontWeight="bold" >
                    Welcome!
                </Typography>
                <Typography fontSize= '1rem' mb={2}>
                    Log in to continue
                </Typography>
                <TextField label="Email" fullWidth margin="normal" />
                <TextField label="Password" type="password" fullWidth margin="normal" />
                <Button variant="contained" fullWidth sx={{ my: 2 }}>
                    Log In
                </Button>
                <Typography> Don't have an account? <Button onClick={() => {setSigninOpen(true); onClose();} } > 
                    Sign Up</Button> </Typography>
            </Box>
        </Modal>

        <SigninModal open={signinOpen} onClose={() => setSigninOpen(false)} />
    </>
);
};

export default LoginModal;

