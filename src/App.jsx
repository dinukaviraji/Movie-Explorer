import './App.css'
import { useState, useEffect } from 'react';
import Homepage from './pages/homepage';
import DetailsPage from './pages/detailspage';
import BrowseMovies from './pages/BrowseMovies';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/navbar';
import FavoriteMovies from './pages/Favourites';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (

    <Router>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: isDarkMode
            ? 'linear-gradient(to right, #0C134F, #03001C)'
            : 'linear-gradient(to right, #7393B3, #5F9EA0)',
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Box sx={{ p: 3 }}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movie/:id" element={<DetailsPage />} />
        <Route path="/browse-movies" element={<BrowseMovies />} />
        <Route path="/favorites" element={<FavoriteMovies />} />
      </Routes>
      </Box>
      </Box>

    </Router>

  );
}

export default App;



