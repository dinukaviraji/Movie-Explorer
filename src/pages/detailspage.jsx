import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getBackdrops } from '../api/api';
import { Box, Typography, Chip, CircularProgress, Button } from '@mui/material';
// import star from '../assets/star.png';

const DetailsPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL

  const [movie, setMovie] = useState(null);  // Store movie details
  const [cast, setCast] = useState([]); // Store cast members
  const [trailerKey, setTrailerKey] = useState('');
  const [loading, setLoading] = useState(true);
    const [backdrop, setBackdrops] = useState([]); // Store backdrops

    const [visibleOverview, setVisibleText] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [movieData, creditsData, videosData, backdrops] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getBackdrops(id),

        ]);

        setMovie(movieData); // Save movie details
        setCast(creditsData.cast.slice(0, 5) || []); // top 5 cast
        setBackdrops(backdrops);

         // Find the trailer from the videos list
        const trailer = videosData?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        setTrailerKey(trailer?.key || '');
      } catch (error) {
        console.error('Error loading movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

    useEffect(() => {
        if (!movie?.overview) return; // skip until overview exists
        
        let text = movie.overview;
        const sentences = text.split('. ');
        let visible = '';
        let sentenceCount = sentences.length > 2 ? 2 : sentences.length; // Show 3 sentences or less if there are fewer than 3

        for (let i = 0; i < sentenceCount; i++) {
            visible += sentences[i] + '. ';
        }
        setVisibleText(visible.trim());

    }, [movie]);


  if (loading) return <CircularProgress />;   // Show spinner while loading
  if (!movie) return <Typography>Movie not found.</Typography>;   // Show message if movie is not found


return (
    <Box p={4}>
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '500px', md: '100vh' }, borderRadius: '10px', overflow: 'hidden'}}>
           
            <Box sx={{ 
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height:  { xs: '500px', md: '100vh' },
            borderRadius: '10px',
            // position: 'relative',
            zIndex: 1,
            }}> 

                <Box sx={{px:4, py:1, position:'absolute', top: {xs:'1%', md:'40%'}}}>
                <Typography sx={{fontSize: {xs: 'h4.fontSize', md:'h3.fontSize'}, fontFamily:'Vogue'}}>{movie.title}</Typography>      
                <Box>
                    <Typography variant="body2" gap={2}> ⭐ {movie.vote_average?.toFixed(1)} | {movie.genres.map(genre => genre.name).join(', ')} | {movie.release_date?.substring(0,4)}
                    </Typography>
            
                </Box>
                <Typography variant="body1" mt={2} width={{xs:'100%', md: '45%'}}> {visibleOverview} </Typography>

                <Button sx={{backgroundColor:'#0C134F', zIndex:3, color:'whitesmoke', px:4, py:1, my:2,fontSize:'overline.fontSize',boxShadow: '0px 2px 5px rgba(0,0,0,0.3)'}} 
                onClick={() => window.open(`https://www.youtube.com/embed/${trailerKey}`,'_blank')}> 
                    TRAILER </Button>
                </Box>
                         
                <Box
                    sx={{
                        position: 'absolute',
                        top: "40%",
                        left:'55%',
                        right: 0,
                        display: {xs:'none', md:'flex'},
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        gap: 2,
                        px: 2,
                        
                        '&::-webkit-scrollbar': { display: 'none' },
                        zIndex:10,
                    }}
                    >
                    {backdrop.map((img) => (
                        <Box
                        key={img.file_path}
                        sx={{
                            flex: '0 0 auto',
                            scrollSnapAlign: 'start',
                            width: 160,
                            height: 90,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                        >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                            alt="backdeop"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        </Box>
                    ))}
                </Box>
                    

            </Box>


            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to top, rgba(250, 250, 250, 0.6), transparent 70%)`,
                zIndex: 2,
            }} />
        </Box>
        
        <Box display="flex" alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            {movie.poster_path && (
            <Box>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '250px', borderRadius: '10px' }}
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
            <Box my={4}>
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
