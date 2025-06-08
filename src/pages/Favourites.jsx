import { useEffect, useState } from 'react';
import { Box, Typography} from '@mui/material';
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
    favorites.length === 0 ? (
      <Box sx={{ p:{xs:10, md: 10}, mx:{md: 10}}}>
      <Box sx={{ backgroundColor: 'rgba(250, 250, 250, 0.2)', borderRadius: 2, height: 200, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <Typography variant="h5" mb={2} align='center' sx={{fontFamily:'ClashGrotesk', fontWeight: 'bold'}}>No Favourites Yet</Typography>
        <Typography variant="body1" align='center' sx={{fontFamily:'monospace'}}> You can add movies to your favourites by clicking "Heart Icon".</Typography>

      </Box>
      </Box>
    ) : (
      <Box sx={{ px: 3, py: 6 }}>
        <Typography variant="h5" mb={2} align='center' sx={{fontFamily:'ClashGrotesk'}}>Your Favourite Movies</Typography>
        <MovieGrid
          movies={favorites}
          onFavoriteToggle={toggleFavorite}
          favorites={favorites}
        />
      </Box>
    )
  );
};

export default FavoriteMovies;
