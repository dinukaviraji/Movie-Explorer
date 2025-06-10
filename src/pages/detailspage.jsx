import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getBackdrops } from '../api/api';
import { Box, Typography, Button, Modal, Grid, IconButton, Stack} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';


const DetailsPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL

  const [loading, setLoading] = useState(true); // Loading state
  const [movie, setMovie] = useState(null);  // Store movie details
  const [cast, setCast] = useState([]); // Store cast members
  const [trailerKey, setTrailerKey] = useState('');
  const [backdrop, setBackdrops] = useState([]); // Store backdrops

  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = backdrop[selectedImageIndex] ? `https://image.tmdb.org/t/p/w1280${backdrop[selectedImageIndex].file_path}` : '';
  
  const handlePrevImage = () => {
    setSelectedImageIndex((index) => (index > 0 ? index - 1 : index));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((index) => (index < backdrop.length - 1 ? index + 1 : index));
  };

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

  if (loading) return null;  

return (
    <Box >
      <Box sx={{ position: 'relative', width: '100%', height: { xs: '500px', md: '100vh' }, borderRadius: '10px', overflow: 'hidden'}}>
          
        <Box sx={{ 
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height:  { xs: '500px', md: '100vh' }, 
        borderRadius: '10px',
        // position: 'relative',
        zIndex: 1  }}> 

          <Box sx={{px:{xs:2, md:4}, py:{xs:8, md:1}, position:'absolute', top: {xs:'1%', md:'50%'}, justifyContent:{xs:'center'}}}>
            <Typography sx={{fontSize: {xs: 'h4.fontSize', md:'h3.fontSize'}, fontFamily:'Vogue', color:'white'}}>
              {movie.title}
            </Typography>      
       
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StarIcon fontSize="small" sx={{ color: 'gold'}}/>
              <Typography variant="body2" gap={2} color='white' fontFamily='Sora'> {movie.vote_average?.toFixed(1)} | {movie.genres.map(genre => genre.name).join(', ')} | {movie.release_date?.substring(0,4)}</Typography>
            </Stack>          
          
            <Typography variant="body1" mt={2} width={{xs:'100%', md: '50%'}} color='white' fontFamily='Sora'> 
              {movie.overview.split('. ').slice(0,2).join('. ')}
            </Typography>

            <Button sx={{backgroundColor:'#0C134F', zIndex:3, color:'whitesmoke', px:4, py:1, mt:3,fontSize:'overline.fontSize',boxShadow: '0px 2px 5px rgba(0,0,0,0.3)', 
            '&:hover': { boxShadow: '0px 4px 10px rgba(0,0,0,0.4)'}}} 
            onClick={() => window.open(`https://www.youtube.com/embed/${trailerKey}`,'_blank')}> 
                TRAILER 
            </Button>
          </Box>

          <Typography sx={{position: 'absolute', top:'50%', left:'55%',display:{xs:'none', md:'flex'}, color:'white', fontFamily:'Sora'}}> 
                  Posters 
          </Typography>
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
              }} >
              {backdrop.map((img, index) => (
                <Box
                  key={img.file_path}
                  sx={{
                    flex: '0 0 auto',
                    scrollSnapAlign: 'start',
                    width: 160,
                    height: 90,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }} >

                  <img 
                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                    alt="backdrop"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer'}}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        // Open in new tab if Ctrl or Command key is pressed
                        window.open(`https://image.tmdb.org/t/p/w1280${img.file_path}`, '_blank');
                      } else {
                        setSelectedImageIndex(index);
                        setOpen(true);}}}
                  />
                </Box>
                    ))}
              </Box>

          {/* Cast section for medium/ large screens - Inside the background image */}
          <Box>  
            <Typography sx={{position: 'absolute', top:'75%', left:'55%',display:{xs:'none', md:'flex'}, color:'white', fontFamily:'Sora'}}> 
                Cast 
              </Typography>

              <Box 
                sx={{
                  position: 'absolute', 
                  top:'80%', 
                  left:'55%', 
                  gap:1,
                  display:{xs:'none', md:'flex'},
                  zIndex:3,
                }}>

                {cast.slice(0, 4).filter((actor) => actor.profile_path)  // Filering out actors without profile images within first 4 actors
                .map(actor => (
                  <Box key={actor.id}>
                    <img
                    src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}` }
                        alt={actor.name}
                        style={{ width: 70, height:70,borderRadius: '50%', objectFit: 'cover'}}
                    />
                    <Typography sx={{textAlign:'center', lineHeight:1, color:'#353a3e',  fontSize:'0.75rem', fontFamily:'Sora'}}>
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
                  }}>
                    View All
                </Button>
            </Box>    
          </Box>             
        </Box>

            <Box sx={{    // Transparent gradient overlay on the background image
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to top, rgba(250, 250, 250, 0.6), transparent 70%)`,
                zIndex: 2,
            }}/>
      </Box>


           {/* images horizontal carousel for small screens - Outside the background image */}
        <Typography sx={{display:{xs:'flex', md:'none'}, mt:2}}> Posters </Typography>
        <Box sx={{position: 'relative', display: {xs:'flex', md:'none'},  overflowX: 'auto',
                scrollSnapType: 'x mandatory', gap: 2, p: 2, '&::-webkit-scrollbar': { display: 'none' } }}>                 
          {backdrop.map((img, index) => (
            <Box
              key={img.file_path}
              sx={{flex: '0 0 auto', scrollSnapAlign: 'start', width: 150, height: 90, borderRadius: 2, overflow: 'hidden'}}>
              <img
                src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                alt="backdeop"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onClick={() => { setSelectedImageIndex(index);
                                  setOpen(true);}} 
              />
            </Box>
          ))}
        </Box>

        {/* Cast section for small screens - Outside the background image*/}
        <Typography sx={{display:{xs:'flex', md:'none'}, my:2}}> Cast </Typography>
        <Box 
          sx={{    
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
              }} >
              View All
            </Button>
        </Box>                   


        {/* Modal for show expanded images */}
      <Modal
        open={open} onClose={() => setOpen(false)} closeAfterTransition
        sx={{ backdropFilter: 'blur(5px)',  display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
        <Box
          sx={{ outline: 'none', maxWidth:{xs:'90%', md:'70%'}, maxHeight:{xs:'90%', md:'70%'}, borderRadius: 2,overflow: 'hidden', boxShadow: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>        
            <IconButton> 
              <Typography sx={{color: 'white', fontSize:{xs:'1rem', md:'2rem'},borderRadius: '50%', padding:{xs:'0.05rem 0.5rem', md:'0.05rem 0.8rem'}, 
                                backgroundColor: 'rgba(255,255,255, 0.3)'}} onClick={handlePrevImage}> 
                {'<'} 
              </Typography> 
            </IconButton>

            <Box component='img' src={selectedImage} alt="expanded" sx={{ width:{xs:'80%',md:'90%'}, height: 'auto', objectFit: 'contain' }}/>
            
            <IconButton>
              <Typography sx={{color: 'white', fontSize:{xs:'1rem', md:'2rem'},borderRadius: '50%', padding:{xs:'0.05rem 0.5rem', md:'0.05rem 0.8rem'}, 
                                backgroundColor: 'rgba(255,255,255, 0.3)'}} onClick={handleNextImage}> 
                {'>'}
              </Typography> 
            </IconButton>

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
          <Typography  sx={{display:'flex', justifyContent:'center', color:'white',mb:2, fontFamily:'Sora', fontSize:{xs:'1rem', md:'1.5rem'} , textDecoration:'underline', textUnderlineOffset: '0.3rem'}}>
            Cast of {movie.title}
          </Typography>

          <Grid container spacing={{xs:2,md:3}}>
            {cast
              .filter((actor) => actor.profile_path) // Filter out actor don't have images
              .map((actor) => (
              <Grid item key={actor.id}>
                <Box textAlign="center">
                  <Box
                    component='img'
                    src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    sx={{ width:{xs:60 ,md:110}, borderRadius: 2, objectFit: 'cover', }}
                  />
                  {/* check if the actor's name is too long. If it too long display second name in a new line */}
                  <Typography sx={{ mt:1, color:'white', fontSize:{xs:'0.7rem', md:'0.875rem'}, fontFamily:'Sora',}}>  
                    {actor.name.split(' ').slice(0,2).join(' ').length > 10 ?                                          
                    <> {actor.name.split(' ')[0]} <br/> {actor.name.split(' ')[1]} </> : actor.name.split(' ').slice(0,2).join(' ')} 
                  </Typography>
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
