import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getBackdrops } from '../api/api';
import { Box, Typography, Button, Modal, Grid, IconButton, Stack} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Cast from '../components/Cast'; 

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


  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

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
      const handleResize = () => setScreenHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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
        position: 'relative',
        zIndex: 1  }}> 

          <Box sx={{px:{xs:2, md:4}, py:{xs:8, md:1}, position:'absolute', top: {xs:'1vh', md:'45vh'}}}>
            <Typography sx={{fontSize: {xs: '1.5rem', md:'3rem'}, fontFamily:'Vogue', color:'white'}}>
              {movie.title}
            </Typography>      
       
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StarIcon fontSize="small" sx={{ color: 'gold'}}/>
              <Typography variant="body2" gap={2} color='white' fontFamily='Inter'> {movie.vote_average?.toFixed(1)} | {movie.genres.map(genre => genre.name).slice(0,3).join(', ')} | {movie.release_date?.substring(0,4)}</Typography>
            </Stack>          
          
            <Typography sx={{mt:2, width:{xs:'100%', md: '45vw'}, fontFamily:'Inter', fontSize:{xs:'0.87rem',md:'1rem'}, color:'white'}}> 
              {movie.overview.split('. ').slice(0,2).join('. ')}.
            </Typography>

            <Button sx={{backgroundColor:'#0C134F', zIndex:3, color:'whitesmoke', px:4, py:1, mt:2,fontSize:'overline.fontSize',boxShadow: '0px 2px 5px rgba(0,0,0,0.3)', 
            '&:hover': { boxShadow: '0px 4px 10px rgba(0,0,0,0.4)'}}} 
            onClick={() => window.open(`https://www.youtube.com/embed/${trailerKey}`,'_blank')}> 
                TRAILER 
            </Button>

              {/* Cast section for large screens - Inside the background image */}
            { screenHeight > 800 && ( // Show only if screen height is greater than 800px
              <Box sx={{ position:'relative', display:{xs:'none', md:'none', xl:'flex'}, zIndex:3, mt:5}}>
              <Cast cast={cast} numberOfCast={10} movieTitle={movie.title} Width={'4vw'} Height={'12vh'} Color={'#353a3e'}/>
              </Box>
            )}
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
                  zIndex:3,
              }} >
              {backdrop.map((img, index) => (
                <Box
                  key={img.file_path}
                  sx={{
                    flex: '0 0 auto',
                    scrollSnapAlign: 'start',
                    width:'10vw',
                    height:'12vh',
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

          <Box sx={{position: 'absolute', top:'71%', left:'55%',display:{xs:'none', md:'flex', xl:'none'}, zIndex:3}}>  
             <Cast cast={cast} numberOfCast={5} movieTitle={movie.title} Width={'5vw'} Height={'15vh'} Color={'#353a3e'}/>
          </Box>

            <Box sx={{    // Transparent gradient overlay on the background image
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: `linear-gradient(to top, rgba(250, 250, 250, 0.6), transparent 70%)`,
                zIndex: 2,
            }}/>
            </Box>
    </Box>


           {/* images horizontal carousel for small screens - Outside the background image */}
        <Typography sx={{display:{xs:'flex', md:'none'}, my:2, ml:2, fontFamily:'Sora'}}> Posters </Typography>
        <Box sx={{position: 'relative', display: {xs:'flex', md:'none'},  overflowX: 'auto',
                scrollSnapType: 'x mandatory', gap: 2, ml:2, '&::-webkit-scrollbar': { display: 'none' } }}>                 
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
        <Box sx={{position: 'relative', display:{xs:'flex', md:'none'}, zIndex:3, my:2, ml:2}}>
          <Cast cast={cast} numberOfCast={4} movieTitle={movie.title} Width={'12vw'} Height={'15vh'}/>
        </Box>                  


        {/* Modal for show expanded images */}
      <Modal
        open={open} onClose={() => setOpen(false)} closeAfterTransition
        sx={{ backdropFilter: 'blur(5px)',  display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
        <Box
          sx={{ outline: 'none', maxWidth:{xs:'90%', md:'80%'}, maxHeight:{xs:'90%', md:'80%'}, borderRadius: 2,overflow: 'hidden', boxShadow: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>        
            <IconButton> 
              <Typography sx={{color: 'white', fontSize:{xs:'1rem', md:'2rem'},borderRadius: '50%', padding:{xs:'0.05rem 0.5rem', md:'0.05rem 0.8rem'}, 
                                backgroundColor: 'rgba(255,255,255, 0.3)'}} onClick={handlePrevImage}> 
                {'<'} 
              </Typography> 
            </IconButton>

            <Box component='img' src={selectedImage} alt="expanded" sx={{ width:{xs:'80%', md:'88%', xl:'90%'}, height: 'auto', objectFit: 'contain' }}/>
            
            <IconButton>
              <Typography sx={{color: 'white', fontSize:{xs:'1rem', md:'2rem'},borderRadius: '50%', padding:{xs:'0.05rem 0.5rem', md:'0.05rem 0.8rem'}, 
                                backgroundColor: 'rgba(255,255,255, 0.3)'}} onClick={handleNextImage}> 
                {'>'}
              </Typography> 
            </IconButton>

        </Box>
      </Modal>

    </Box> 
);
};

export default DetailsPage;
