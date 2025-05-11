import { Grid, Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title, favorites, onFavoriteToggle }) => {
  return (
    <Box sx={{ mt:2 }}>
      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Grid item key={movie.id}>
              <MovieCard movie={movie} 
              isFavorited={favorites.some((fav) => fav.id === movie.id)}  onFavoriteToggle={onFavoriteToggle}/>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            No movies to display.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
