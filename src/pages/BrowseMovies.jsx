import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Button, CircularProgress, IconButton, InputAdornment} from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { getGenres, getPopularMovies, discoverMovies, searchMovieByName } from '../api/api';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const BrowseMovies = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

    const searchMovies = async () => {

      const results = await searchMovieByName(searchTerm);
      if (results.length > 0) {
          console.log('Search results:', results);
          const firstMovieId = results[0].id;
          console.log('First match ID:', firstMovieId);
          navigate(`/movie/${firstMovieId}`);
 
      } else {
          console.log('No movies found!');
      }
    };

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
      <Typography variant="h5"  sx={{mt:5, mb:2, fontFamily: 'ClashGrotesk',display: 'flex', justifyContent:{ xs: 'center', md: 'left' }}} >
        Browse Movies</Typography>

      <Box sx={{ mb: 3, flex: 1, display: 'flex', justifyContent: 'center' }}>
        {/* Search Input */}
        <TextField
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

          onKeyDown={(e) => {
            if (e.key === 'Enter') {searchMovies();}}}

          sx={{
            borderRadius: 5,
            backgroundColor: '#f0f8ff',
            width: '80%',
            '& .MuiInputBase-root': {
              height: 35,
              fontSize: '0.9rem',
            },
            border: 'none',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  border: 'none',}
            },
           
          }}
          InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={searchMovies}>
                    <SearchIcon/>
                  </IconButton>
                </InputAdornment> 
              ),
          }}/>

      </Box>

      {/* Filters Section */}
      <Box sx={{  display: 'flex', flexWrap: 'wrap', justifyContent: {xs:'left', md:'center'}, gap:{xs:1, md: 2}, mb: 3}}>

        {/* Genre Dropdown */}
        <Select
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          displayEmpty
          sx={{ minWidth: 100, bgcolor: '#f0f8ff', height: 35 }}
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
        sx={{
          width: 100,
          bgcolor: '#f0f8ff',
          '& .MuiInputBase-root': {
            height: 35,
            fontSize: '0.9rem',},
          '& .MuiInputLabel-root': {
            top: -6,
            fontSize: '0.75rem',
          },
          '& .MuiInputLabel-shrink': {
            top: 0,
          }
  }}
/>

        {/* Rating Dropdown */}
        <Select
          name="rating"
          value={filters.rating}
          onChange={handleChange}
          displayEmpty
          sx={{ minWidth: 100, bgcolor: '#f0f8ff', height: 35 }}
        >
          <MenuItem value="">All Ratings</MenuItem>
          {[9, 8, 7, 6, 5].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {`${rating}+ stars`}
            </MenuItem>
          ))}
        </Select>

        {/* Search Button for laptop screens */}
        <Button variant="contained" onClick={handleSearch} sx={{height:35, width:150, display:{ xs: 'none', md: 'flex' }}}>
          Search
        </Button>
      </Box>

      {/* Search Button for mobile screens */}
      <Button variant="contained" onClick={handleSearch} sx={{height:35, width:300, display:{ xs: 'flex', md: 'none' }, justifyContent: 'center', mx: 'auto'}}>
          Search
        </Button>

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
