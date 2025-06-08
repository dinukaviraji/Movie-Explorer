import { useEffect, useState } from 'react';
import { getTrendingMovies } from '../api/api';
import MovieGrid from '../components/MovieGrid';
import HeroSection from '../components/HeroSection';
import { Button, Box, Typography} from '@mui/material';

const Homepage = () => {
  const [movies, setMovies] = useState([]);  // Store list of trending movies
  const [buffer, setBuffer] = useState([]); // Unused fetched movies
  const [tmdbPage, setTmdbPage] = useState(1); // Current page to fetch from TMDB

  const moviesPerRow = () => {
    const width = window.innerWidth;
    if (width >= 1200) return 7; // Large screens
    if (width >= 900) return 4; // Medium screens
    if (width >= 600) return 3; // Small screens
    return 1; // Extra small screens
  }

  // Fetch trending movies 
  const fetchMovies = async () => {
    const perRow = moviesPerRow();
    const desiredCount = perRow * 4;

    let collected = [...buffer];
    let page = tmdbPage;

    // Keep fetching pages until we have enough
    while (collected.length < desiredCount) {
      const fetched = await getTrendingMovies(page);
      collected = [...collected, ...fetched];
      page++;
    }

    const toRender = collected.slice(0, desiredCount);
    const newBuffer = collected.slice(desiredCount);

    setMovies(prev => [...prev, ...toRender]);
    setBuffer(newBuffer);
    setTmdbPage(page); 
  };

  useEffect(() => {
    fetchMovies(); // initial load
  }, []);

  // Load more movies by increasing the page number
  // const handleLoadMore = () => {
  //   setPage((prevPage) => prevPage + 1);
  // };

  // Load favorites from localStorage when the component mounts
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  
  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id); // Check if it's already favorited
    const updated = exists
      ? favorites.filter((fav) => fav.id !== movie.id) // Remove if exists
      : [...favorites, movie]; // Add if not
  
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  

  return (
    <Box sx={{ px:{md: 3}, py: 4 }}>
        <HeroSection/>
        <Typography variant="h5" sx={{my: 2, fontFamily: 'ClashGrotesk'}}>
          Trending Movies</Typography>
        <MovieGrid
        movies={movies}
        onMovieClick={(movie) => console.log('Clicked:', movie)}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite}
        />
        <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" onClick={fetchMovies}> Load more </Button>
        </Box>
    </Box>
  );
};

export default Homepage;
