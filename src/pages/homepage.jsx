import { useEffect, useState } from 'react';
import { getTrendingMovies } from '../api/api';
import MovieGrid from '../components/MovieGrid';
import HeroSection from '../components/HeroSection';
import { Button, Box, Typography} from '@mui/material';

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const fetchMovies = async () => {
    const newMovies = await getTrendingMovies(page);
    setMovies((prev) => page === 1 ? newMovies : [...prev, ...newMovies]);
  };

  useEffect(() => {
    fetchMovies(); // initial load
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  
  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
  
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  

  return (
    <Box sx={{ px: 3, py: 4 }}>
        <HeroSection/>
        <Typography variant="h5" my={2}>Trending Movies</Typography>
        <MovieGrid
        movies={movies}
        onMovieClick={(movie) => console.log('Clicked:', movie)}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite}
        />
        <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" onClick={handleLoadMore}> Load more </Button>
        </Box>
    </Box>
  );
};

export default Homepage;
