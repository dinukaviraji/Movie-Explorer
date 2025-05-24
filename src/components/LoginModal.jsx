import { Modal, Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import SigninModal from './SigninModal';
import { useState } from 'react';

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {xs:315,md:350},
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  px: 4,
  py: 1,
};

const LoginModal = ({ open, onClose }) => {
    const [signinOpen, setSigninOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (!storedUser) {
          setSnackbar({ open: true, message: 'No account found. Please sign up first.', severity: 'warning' });
          return;
        }
    
        if (email === storedUser.email && password === storedUser.password) {
          setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
          onClose(); // Close modal after login
        } else {
          setSnackbar({ open: true, message: 'Invalid email or password.', severity: 'error' });
        }
      };

return (
    <>
        <Modal
            open={open}
            onClose={onClose}
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
                <TextField label="Email" fullWidth margin="normal" value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                     // These styles for change the default textfield styles 
                    sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, '& input': {padding:'8px 12px'}}, 
                          '& .MuiInputLabel-root': {fontSize:14, top:-7}, '& .MuiInputLabel-shrink': {top:-1}}}/>

                <TextField label="Password" type="password" fullWidth margin="normal" value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, '& input': {padding:'8px 12px'}}, 
                          '& .MuiInputLabel-root': {fontSize:14, top:-7}, '& .MuiInputLabel-shrink': {top:-1}}}/>

                <Button fullWidth sx={{ my: 2, backgroundColor:'#0C134F', color:'white'}} onClick={handleLogin}>
                    Log In
                </Button>
                <Typography> Don't have an account? 
                  <Button onClick={() => {setSigninOpen(true); onClose();}} sx={{color:'#1e69b5',background:'none'}} > 
                    Sign Up</Button> 
                </Typography>
            </Box>
        </Modal>

        <SigninModal open={signinOpen} onClose={() => setSigninOpen(false)} />

        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
            
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
);
};

export default LoginModal;

