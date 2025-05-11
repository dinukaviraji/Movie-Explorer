import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../api/api';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';

const DetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id)
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 5) || []); // top 5 cast

        const trailer = videosData.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        setTrailerKey(trailer?.key || '');
      } catch (error) {
        console.error('Error loading movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!movie) return <Typography>Movie not found.</Typography>;

return (
    <Box p={4}>
        <Box display="flex" alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            {movie.poster_path && (
            <Box>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '400px', borderRadius: '10px' }}
                />
            </Box>
            )}
            <Box>
                <Typography variant="h3">{movie.title}</Typography>
                <Typography variant="subtitle1" >{movie.release_date}</Typography>

                <Box my={2} >
                    {movie.genres.map(genre => (
                        <Chip key={genre.id} label={genre.name} sx={{ mr: 1, color:"#1F51FF"}} />
                    ))}
                </Box>

                <Typography variant="body1" mt={2} >{movie.overview}</Typography>
            </Box>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" >Cast</Typography>
            <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                {cast.map(actor => (
                <Box key={actor.id} textAlign="center">
                    <img
                    src={
                        actor.profile_path
                            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                            : 'https://via.placeholder.com/100x150?text=No+Image'
                        }
                        alt={actor.name}
                        style={{ width: 100, borderRadius: 8 }}
                />
                    <Typography>{actor.name}</Typography>
                </Box>
                ))}
            </Box>
        </Box>

        {trailerKey && (
            <Box mt={4}>
                <Typography variant="h5">Trailer</Typography>
                <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    allowFullScreen
                />
            </Box>
        )}
    </Box>
);
};

export default DetailsPage;
