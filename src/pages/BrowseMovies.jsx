import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Button, CircularProgress} from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { getGenres, getPopularMovies, discoverMovies } from '../api/api';

const BrowseMovies = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: ''
  });

  // Fetch genres and initial movie list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [genreData, popularData] = await Promise.all([
        getGenres(),
        getPopularMovies()
      ]);
      setGenres(genreData.genres);
      setMovies(popularData.results);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle dropdown/text input changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters and fetch new movie results
  const handleSearch = async () => {
    setLoading(true);
    const filtered = await discoverMovies(filters);
    setMovies(filtered.results);
    setLoading(false);
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>  
      <Typography variant="h4" gutterBottom mt={7}>Browse Movies</Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3}}>

        {/* Genre Dropdown */}
        <Select
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          displayEmpty
          sx={{ minWidth: 150, bgcolor: '#f0f8ff', }}
        >
          <MenuItem value="" >All Genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>

        {/* Year Input */}
        <TextField
          name="year"
          label="Year"
          type="number"
          value={filters.year}
          onChange={handleChange}
          sx={{ width: 120, bgcolor: '#f0f8ff'}}
        />

        {/* Rating Dropdown */}
        <Select
          name="rating"
          value={filters.rating}
          onChange={handleChange}
          displayEmpty
          sx={{ minWidth: 150, bgcolor: '#f0f8ff' }}
        >
          <MenuItem value="">All Ratings</MenuItem>
          {[9, 8, 7, 6, 5].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {`>= ${rating}`}
            </MenuItem>
          ))}
        </Select>

        {/* Search Button */}
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Movie Results Grid */}
      {loading ? (
        <CircularProgress />
      ) : (
        <MovieGrid movies={movies} onMovieClick={(movie) => console.log('Clicked:', movie)}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite} />
      )}
    </Box>
  );
};

export default BrowseMovies;
