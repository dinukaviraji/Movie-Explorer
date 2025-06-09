import { Box, Typography } from '@mui/material';
const Footer = () => {
  return (
    <Box component="footer"
    sx={{ width: '100%',py: 2, px: 3,mt: 'auto',textAlign: 'center',color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(6px)'}}>
        <Typography sx={{fontSize: { xs: '0.87rem', md: '1rem' }, fontFamily: 'ClashGrotesk', fontWeight:500, mb: 1, a: {color: '#71797E', textDecoration: 'none', '&:hover': {color: 'white'}}}}>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent:'center', gap: '1rem'}}>
                <li><a href='/' > Home </a> </li>
                <li><a href='/favorites'> Favourites </a> </li>
                <li><a href='/browse-movies'> Browse Movies</a> </li>
            </ul>
        </Typography>
        <Typography sx={{fontSize: { xs: '0.87rem', md: '1rem' }, fontFamily: 'ClashGrotesk'}}>
        &copy; {new Date().getFullYear()} Movie Explorer. All rights reserved.
        </Typography>

    </Box>
    );
};

export default Footer;

