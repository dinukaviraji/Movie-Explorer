import { Modal, Box, Typography, TextField, Button } from '@mui/material';

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

const SigninModal = ({ open, onClose }) => {
return (
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
                Create an Account!
            </Typography>

            <TextField label="First Name" fullWidth margin="normal" />
            <TextField label="Second Name" fullWidth margin="normal" />
            <TextField label="Email" fullWidth margin="normal" />
            <TextField label="Password" type="password" fullWidth margin="normal" />
            <Button variant="contained" fullWidth sx={{ my: 2 }}>
                Sign Up
            </Button>

        </Box>
    </Modal>
);
};

export default SigninModal;

