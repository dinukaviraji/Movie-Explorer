import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Button, CircularProgress, IconButton, InputAdornment, InputLabel, FormControl} from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { getGenres, getPopularMovies, discoverMovies, searchMovieByName } from '../api/api';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const BrowseMovies = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
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
      const [genreData, popularData] = await Promise.all([
        getGenres(),
        getPopularMovies()
      ]);
      setGenres(genreData.genres);
      setMovies(popularData.results);
    };

    fetchData();
  }, []);

  // Handle dropdown/text input changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters and fetch new movie results
  const handleSearch = async () => {
    const filtered = await discoverMovies(filters);
    setMovies(filtered.results);
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

    <Box sx={{ px: {xs: 1, md: 4}, mt:{xs: 12, md: 10}, mb:6 }}>  
      <Typography sx={{mt:6, mb:2, fontFamily: 'ClashGrotesk', fontSize:{ xs: '1.4rem', md: '1.6rem' }, display: {xs:'none', md:'flex'}, justifyContent:'center'}} >
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
      <Box sx={{  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap:{xs:1, md: 2}, mb: 3}}>

        {/* Genre Dropdown */}
      
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: { xs: '30vw', sm: '15vw', md: '10vw' } }}>
          <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.85rem' }, mb: 0.5 }}>
            Genre :
          </Typography>
          <Select
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            displayEmpty
            sx={{
              minWidth: 80,
              bgcolor: '#f0f8ff',
              height: 35,
              fontSize: { xs: '0.7rem', md: '0.85rem' },
              width: '100%'
            }}
          >
            <MenuItem value="">All</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        

        {/* Year Input */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: { xs: '20vw', sm: '15vw', md: '10vw' } }}>

          <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.85rem' }, mb: 0.5 }}>
              Year :
          </Typography>
          <TextField
          name="year"
          label="Year"
          type="number"
          value={filters.year}
          onChange={handleChange}
          sx={{
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
        </Box>

        {/* Rating Dropdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: { xs: '30vw', sm: '15vw', md: '10vw' } }}>
          <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.85rem' }, mb: 0.5 }}>
            Rating :
          </Typography>
          <Select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            displayEmpty
            sx={{bgcolor: '#f0f8ff', height: 35, width: {xs: '30vw',sm:'15vw', md: '10vw'}, fontSize: { xs: '0.7rem', md: '0.85rem' }}}
          >
            <MenuItem value=""> All </MenuItem>
            {[9, 8, 7, 6, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {`${rating}+ stars`}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Search Button for laptop screens */}
        <Button sx={{backgroundColor: '#007acc', color: 'white', height:35, width:'10vw', mt:3, display:{ xs: 'none', md: 'flex'}}} onClick={handleSearch} >
          Search
        </Button>
      </Box>

      {/* Search Button for mobile screens */}
      <Button sx={{backgroundColor: '#007acc', color: 'white', height:35, width:300, display:{ xs: 'flex', md: 'none'}, justifyContent: 'center', mx: 'auto'}} onClick={handleSearch}>
          Search
        </Button>

      {/* Movie Results Grid */}    
        <MovieGrid movies={movies} onMovieClick={(movie) => console.log('Clicked:', movie)}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite} />
      
    </Box>
  );
};

export default BrowseMovies;
