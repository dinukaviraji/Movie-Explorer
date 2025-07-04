import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText, Box, Switch} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/popcorn.svg'

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [show, setShow] = useState(false);

    const [loginOpen, setLoginOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
          // Show navbar after scrolling down 100px
          setShow(window.scrollY > 100);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);


  const navLinks = ['Home', 'Favourites', 'Browse Movies'];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const getPath = (text) => {
    switch (text) {
      case 'Home': return '/';
      case 'Favourites': return '/favorites';
      case 'Browse Movies': return '/browse-movies';
      default: return '/';
    }
  };


return (
    <>
        <AppBar position="fixed" elevation={show ? 4 : 0}
            sx={{
            backgroundColor: show ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: show ? undefined : 'none',
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight:600, display: {xs:'none',md:'flex'}, alignItems: 'center', fontFamily: 'GODOFWAR', cursor:"pointer"}} onClick={() => {navigate('/')}}>
                    <img src={logo} alt="Logo" style={{ width: 30, marginRight: 8 }} />
                    PopCorn
                </Typography>

               {/* Desktop Menu  */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    {navLinks.map((text) => (
                        <Button key={text} sx={{fontWeight: 500, fontFamily:'ClashGrotesk', textTransform: 'none', color:'white', fontSize:'1rem' }} component={Link} to={getPath(text)}>
                            {text}</Button>
                    ))}
                </Box>

                
                {/* Mobile Menu Button */}
                <IconButton
                    edge="start"
                    aria-label="menu"
                    sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>

                {/* Logo in mobile screens */}
                <Typography variant="h6" component="div" sx={{ fontWeight:600, display: {xs:'flex',md:'none'}, alignItems: 'center',justifyContent:'center' , fontFamily: 'GODOFWAR'}} onClick={() => {navigate('/')}}>
                    <img src={logo} alt="Logo" style={{ width: 25, marginRight: 8 }} />
                    PopCorn
                </Typography>

                {/* Right-side Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                <Switch checked={isDarkMode} onChange={toggleTheme} />

                <Button sx={{fontWeight: 500, fontFamily:'ClashGrotesk', textTransform: 'none', color:'white', fontSize:'1rem' }} onClick={() => setLoginOpen(true)}>
                    Login</Button>
                </Box>

            </Toolbar>
        </AppBar>

        {/* Drawer for Mobile */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{ display: { md: 'none' },
                  '& .MuiDrawer-paper': {
                    background:'linear-gradient(to right, #0C134F, #03001C)',
                    height: 400,
                  }
            }}
        >
            <List sx={{ width: 200 }}>
                {navLinks.map((text) => (
                    <ListItem button key={text} onClick={toggleDrawer(false)}>
                        <ListItemText primary={<Typography sx={{fontFamily:'ClashGrotesk', textDecoration: 'none', color:'wheat', fontSize:'1rem' }} component={Link} to={getPath(text)} > 
                            {text}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </Drawer>

        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
);
};

export default Navbar;
