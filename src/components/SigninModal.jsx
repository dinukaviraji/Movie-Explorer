import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  px: 4,
  py: 1,
};

const SigninModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Save data to localStorage
    localStorage.setItem('user', JSON.stringify(formData));

    // Show success snackbar
    setSnackbar({ open: true, message: 'Account successfully created!', severity: 'success' });

    // Close modal
    onClose();
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
          <Typography variant="h6" fontWeight="bold">
            Create an Account!
          </Typography>

          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, 
              '& input': {padding:'8px 12px'}}, 
              '& .MuiInputLabel-root': {fontSize:14, top:-7},
             '& .MuiInputLabel-shrink': {top:-1}}}
          />
          <TextField
            label="Second Name"
            fullWidth
            margin="normal"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, 
              '& input': {padding:'8px 12px'}}, 
              '& .MuiInputLabel-root': {fontSize:14, top:-7},
             '& .MuiInputLabel-shrink': {top:-1}}}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, 
              '& input': {padding:'8px 12px'}}, 
              '& .MuiInputLabel-root': {fontSize:14, top:-7},
             '& .MuiInputLabel-shrink': {top:-1}}}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{'& .MuiInputBase-root': {height: 35, fontSize: 14, 
              '& input': {padding:'8px 12px'}}, 
              '& .MuiInputLabel-root': {fontSize:14, top:-7},
             '& .MuiInputLabel-shrink': {top:-1}}}
          />
          <Button fullWidth sx={{ my: 2, backgroundColor:'#0C134F', color:'white' }} onClick={handleSubmit}>
            Sign Up
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SigninModal;

