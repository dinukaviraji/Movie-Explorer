import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText, Box, Switch} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom';
import logo from '../assets/popcorn.svg'

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [show, setShow] = useState(false);

    const [loginOpen, setLoginOpen] = useState(false);

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
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontFamily: 'GODOFWAR'}} >
                    <img src={logo} alt="Logo" style={{ width: 30, marginRight: 8 }} />
                    PopCorn
                </Typography>

               {/* Desktop Menu  */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    {navLinks.map((text) => (
                        <Button key={text} color="inherit" sx={{ fontWeight: 'bold',  textTransform: 'none' }} component={Link} to={getPath(text)}>
                            {text}</Button>
                    ))}
                </Box>

                {/* Right-side Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Mobile Menu Button */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Switch checked={isDarkMode} onChange={toggleTheme} />

                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={() => setLoginOpen(true)}>
                    Login</Button>
                </Box>

            </Toolbar>
        </AppBar>

        {/* Drawer for Mobile */}
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{ display: { md: 'none' } }}
        >
            <List sx={{ width: 200 }}>
                {navLinks.map((text) => (
                    <ListItem button key={text} onClick={toggleDrawer(false)}>
                        <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }} component={Link} to={getPath(text)}>{text}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </Drawer>

        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
);
};

export default Navbar;
