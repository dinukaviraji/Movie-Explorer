import { useEffect, useState } from 'react';
import { getTrendingMovies } from '../api/api';
import MovieGrid from '../components/MovieGrid';
import HeroSection from '../components/HeroSection';
import { Button, Box, Typography} from '@mui/material';

const Homepage = () => {
  const [movies, setMovies] = useState([]);  // Store list of trending movies
  const [page, setPage] = useState(1); // Current page number for pagination
  const [showLoadMore, setShowLoadMore] = useState(false); // Control visibility of "Load More" button
  const [showTopic, setShowTopic] = useState(false); // Control visibility of topic section

  // Fetch trending movies 
  const fetchMovies = async () => {
    const newMovies = await getTrendingMovies(page);
    // If it's the first page, replace the list. Otherwise, add new movies to the list.
    setMovies((prev) => page === 1 ? newMovies : [...prev, ...newMovies]); 
  };

  useEffect(() => {
    fetchMovies(); // initial load

    setTimeout(() => {
      setShowTopic(true); 
    }, 100);   

    setTimeout(() => {
        setShowLoadMore(true); // Show "Load More" button after 2 seconds
    }, 2000);
  }, [page]);

  // Load more movies by increasing the page number
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

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
    <Box mb={5}>
        <HeroSection onLoadComplete={() => setHeroLoaded(true)}/>
        {showTopic &&
          <Typography sx={{my: 3, mx:5, fontFamily: 'ClashGrotesk', fontSize:{ xs: '1.4rem', md: '1.6rem' }, fontWeight: 400}} >
            Trending Movies
          </Typography> }

        <MovieGrid
        movies={movies}
        onMovieClick={(movie) => console.log('Clicked:', movie)}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite}
        
        />
        { showLoadMore && 
          <Box display="flex" justifyContent="center" mt={5}>
            <Button 
              sx={{ backgroundColor: '#007acc', color: 'white', borderRadius: 30, px: 5, fontFamily: 'Sora',
                '&:hover': { backgroundColor: '#0096FF'}
              }} 
              onClick={handleLoadMore}
            > 
              Load more 
            </Button>
          </Box>}
    </Box>
  );
};

export default Homepage;
