import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getBackdrops } from '../api/api';
import { Box, Typography, Button, Modal, Grid} from '@mui/material';
// import star from '../assets/star.png';

const DetailsPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL

  const [movie, setMovie] = useState(null);  // Store movie details
  const [cast, setCast] = useState([]); // Store cast members
  const [trailerKey, setTrailerKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [backdrop, setBackdrops] = useState([]); // Store backdrops

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [openCast, setOpenCast] = useState(false);
  const handleOpen = () => setOpenCast(true);
  const handleClose = () => setOpenCast(false);


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
        setCast(Array.isArray(creditsData.cast) ? creditsData.cast : []); 
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

                <Box sx={{px:4, py:1, position:'absolute', top: {xs:'1%', md:'45%'}}}>
                <Typography sx={{fontSize: {xs: 'h4.fontSize', md:'h3.fontSize'}, fontFamily:'Vogue', color:'white'}}>{movie.title}</Typography>      
                <Box>
                    <Typography variant="body2" gap={2}  color='white'> ⭐ {movie.vote_average?.toFixed(1)} | {movie.genres.map(genre => genre.name).join(', ')} | {movie.release_date?.substring(0,4)}
                    </Typography>
            
                </Box>
                <Typography variant="body1" mt={2} width={{xs:'100%', md: '45%'}} color='white'> 
                  {movie.overview.split('. ').slice(0,2).join('. ')}. </Typography>

                <Button sx={{backgroundColor:'#0C134F', zIndex:3, color:'whitesmoke', px:4, py:1, mt:3,fontSize:'overline.fontSize',boxShadow: '0px 2px 5px rgba(0,0,0,0.3)'}} 
                onClick={() => window.open(`https://www.youtube.com/embed/${trailerKey}`,'_blank')}> 
                    TRAILER </Button>
                </Box>


                <Typography sx={{position: 'absolute', top:'50%', left:'55%',display:{xs:'none', md:'flex'}, color:'white'}}> 
                        Posters </Typography>
                    {/* Image horizontal carousel for medium/ large screens */}
                <Box                   
                    sx={{
                        position: 'absolute',
                        top: "55%",
                        left:'55%',
                        right: 0,
                        display: {xs:'none', md:'flex'},
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        gap: 1,
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
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer'}}
                            onClick={(e) => {
                                 if (e.ctrlKey || e.metaKey) {
                                    // Open in new tab if Ctrl or Command key is pressed
                                    window.open(`https://image.tmdb.org/t/p/w1280${img.file_path}`, '_blank');
                                    } else {
                                        setSelectedImage(`https://image.tmdb.org/t/p/w1280${img.file_path}`);
                                        setOpen(true);}}
                                     }
                        />
                        </Box>
                    ))}
                </Box>

                <Box>
                    <Typography sx={{position: 'absolute', top:'75%', left:'55%',display:{xs:'none', md:'flex'}, color:'white'}}> 
                        Cast </Typography>
                    <Box sx={{
                        position: 'absolute', 
                        top:'80%', 
                        left:'55%', 
                        gap:1,
                        display:{xs:'none', md:'flex'},
                        zIndex:3,
                        }}>

                    {cast.slice(0, 4).filter((actor) => actor.profile_path)
                    .map(actor => (
                    <Box key={actor.id} >
                    <img
                    src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}` }
                        alt={actor.name}
                        style={{ width: 70, height:70,borderRadius: '50%', objectFit: 'cover'}}
                    />
                    <Typography sx={{textAlign:'center', lineHeight:1, color:'#353a3e',  fontSize:'0.75rem'}}>
                        {actor.name.split(' ')[0]}
                        <br />
                        {actor.name.split(' ')[1]}
                    </Typography>

                    </Box>
                    ))}

                    <Button
                    onClick={handleOpen}
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        backgroundColor:'#ccc',
                        color:'black'
                    }}
                    >
                    View All
                    </Button>
                </Box>                   
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


           {/* images horizontal carousel for small screens */}
        <Typography sx={{display:{xs:'flex', md:'none'}, mt:2}}> Posters </Typography>
        <Box sx={{position: 'relative', display: {xs:'flex', md:'none'},  overflowX: 'auto',
                scrollSnapType: 'x mandatory', gap: 2, p: 2, '&::-webkit-scrollbar': { display: 'none' } }}
            >
            {backdrop.map((img) => (
                <Box
                key={img.file_path}
                sx={{flex: '0 0 auto', scrollSnapAlign: 'start', width: 150, height: 90, borderRadius: 2, overflow: 'hidden'}}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                    alt="backdeop"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
            ))}
        </Box>

        <Typography sx={{display:{xs:'flex', md:'none'}, my:2}}> Cast </Typography>
        <Box sx={{    
                  gap:2,
                  display:{xs:'flex', md:'none'},
                  }}>
                    {cast.slice(0, 3).filter((actor) => actor.profile_path)
                    .map(actor => (
                    <Box key={actor.id} >
                    <img
                    src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}` }
                        alt={actor.name}
                        style={{ width: 60, height:60,borderRadius: '50%', objectFit: 'cover'}}
                    />
                    <Typography sx={{textAlign:'center', lineHeight:1, fontSize:'0.75rem'}}>
                        {actor.name.split(' ')[0]}
                        <br />
                        {actor.name.split(' ')[1]}
                    </Typography>

                    </Box>
                    ))}

                    <Button
                    onClick={handleOpen}
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        backgroundColor:'#ccc',
                        color:'black'
                    }}
                    >
                    View All
                    </Button>
                </Box>                   


              {/* Modal for show expanded images */}
            <Modal
                open={open} onClose={() => setOpen(false)} closeAfterTransition
                sx={{ backdropFilter: 'blur(5px)',  display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                <Box
                sx={{ outline: 'none', maxWidth: '70%', maxHeight: '70%', borderRadius: 2,overflow: 'hidden', boxShadow: 24}}
                >
                <img src={selectedImage} alt="expanded" style={{ width: '100%', height: 'auto', objectFit: 'contain' }}/>
                </Box>
            </Modal>

            {/* Modal to Show Full Cast */}
      <Modal
        open={openCast}
        onClose={handleClose}
        sx={{ overflowY: 'auto' }}
      >
        <Box
          sx={{
            backdropFilter: 'blur(90px)',
            margin: '5% auto',
            padding: 4,
            width: '70%',
            maxHeight: '80vh',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Typography variant="h6" sx={{display:'flex', justifyContent:'center', color:'white',mb:2}}>
            Cast of {movie.title}
          </Typography>

          <Grid container spacing={{xs:5,md:3}}>
            {cast
              .filter((actor) => actor.profile_path) // Filter out actor don't have images
              .map((actor) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={actor.id}>
                <Box textAlign="center">
                  <Box
                    component='img'
                    src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    sx={{ width:{xs:60 ,md:110}, borderRadius: 2, objectFit: 'cover', }}
                  />
                  
                  <Typography sx={{ mt:1, color:'white', fontSize:{xs:'0.75rem', md:'0.875rem'}}}>
                    {actor.name.split(' ').slice(0,2).join(' ')} </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

    </Box>
);
};

export default DetailsPage;
