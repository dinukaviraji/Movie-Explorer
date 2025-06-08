import { Grid, Box } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, favorites, onFavoriteToggle }) => {
  return (
    <Box sx={{ mt:2 }}>
      <Grid container spacing={{xs:1, md: 5}} justifyContent={{md:"center"}}>
          {movies.map((movie) => (
            <Grid item key={movie.id}>
              <MovieCard movie={movie} 
              isFavorited={favorites.some((fav) => fav.id === movie.id)}   // Check if movie is favorited
              onFavoriteToggle={onFavoriteToggle} /> 
            </Grid>
))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
