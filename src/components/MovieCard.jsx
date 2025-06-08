import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

// This component displays a single movie card
const MovieCard = ({ movie, isFavorited, onFavoriteToggle}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height:{ xs: 260, sm:360, md: 360 },
        width: { xs: 140, sm:360, md: 200 },
        maxWidth: 200,
        m: 1,
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { boxShadow: 6 },
      }} 
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          // Open in new tab if Ctrl or Command key is pressed
          window.open(`/movie/${movie.id}`, '_blank');
        } else {
          // Otherwise, navigate to the movie details page
          navigate(`/movie/${movie.id}`);
        }
      }}
    >
      {/* Movie poster */}
      <CardMedia
        component="img"
        sx={{ height: { xs: 200, sm:300, md: 300 } }}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image'
        }
        alt={movie.title}
        
      />
      {/* Movie title and release info */}
      <CardContent sx={{padding: 1}}>
        <Typography noWrap sx={{ fontWeight: 'bold', fontFamily:'Sora', fontSize: { xs: '0.75rem', md: '0.87rem' } }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{color:"text.secondary"}}>
          {movie.release_date?.substring(0, 4)}  • ⭐ {movie.vote_average?.toFixed(1)}
        </Typography>
      </CardContent>

      <IconButton onClick={(e) => {e.stopPropagation(); onFavoriteToggle(movie);}} 
      sx={{ position: 'absolute', top: 5, right: 5 }}>
      {isFavorited ? (
          <FavoriteIcon sx={{ color: 'red' }} />
        ) : (
          <FavoriteBorderIcon sx={{color: 'white'}} />
        )}

      </IconButton>
    </Card>

  );
};

export default MovieCard;
