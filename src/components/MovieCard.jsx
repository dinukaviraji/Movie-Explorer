import React from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, Icon, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteIcon from '@mui/icons-material/Favorite';

const MovieCard = ({ movie, isFavorited, onFavoriteToggle}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 200,
        m: 1,
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <CardMedia
        component="img"
        height="300"
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image'
        }
        alt={movie.title}
        
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date?.substring(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}
        </Typography>
      </CardContent>

      <IconButton onClick={() => onFavoriteToggle(movie)} sx={{ position: 'absolute', top: 5, right: 5 }}>
      {isFavorited ? (
          <FavoriteIcon sx={{ color: 'red' }} />
        ) : (
          <FavoriteTwoToneIcon />
        )}

      </IconButton>
    </Card>
  );
};

export default MovieCard;
