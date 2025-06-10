import { Box, Typography } from '@mui/material';
const Footer = () => {
  return (
    <Box component="footer"
    sx={{ width: '100%',py: 2, px: 3,textAlign: 'center',color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)'}}>
 
        <Typography sx={{fontSize: { xs: '0.87rem', md: '1rem' }, fontFamily: 'ClashGrotesk'}}>
        &copy; {new Date().getFullYear()} Movie Explorer. All rights reserved.
        </Typography>

    </Box>
    );
};

export default Footer;

