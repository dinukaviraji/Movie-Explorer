import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';

const FavoriteMovies = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <Box sx={{ px: 3, py: 6 }}>
      <Typography variant="h5" mb={2} align='center' sx={{fontFamily:'monospace'}}>Your Favorite Movies</Typography>
      <MovieGrid
        movies={favorites}
        onFavoriteToggle={toggleFavorite}
        favorites={favorites}
      />
    </Box>
  );
};

export default FavoriteMovies;
