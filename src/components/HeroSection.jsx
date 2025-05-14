import { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import { getTrendingMovies, searchMovieByName } from '../api/api'; 
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
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

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await getTrendingMovies();
      setMovies(data.slice(0, 5)); // Show only top 5 trending movies
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % movies.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const currentMovie = movies[current];

return (
    <Box
        sx={{
            position: 'relative',
            height: '55vh',
            backgroundSize: 'cover',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            px: 4,
            py: 6,
        }}
    >
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <TextField
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '100px', 
                    width: '60%',
                    maxWidth: '600px',
                    border: 'none',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            border: 'none',
                        }
                    }
                }}
                
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={searchMovies}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment> 
                        ),
                }}
            />
        </Box>

        <Typography variant="h5" fontWeight="bold">
            {currentMovie.title}
        </Typography>
    </Box>
);
};

export default HeroSection;
