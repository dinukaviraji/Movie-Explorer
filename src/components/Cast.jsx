import { Box, Typography, Button, Modal, Grid } from '@mui/material';
import { useState } from 'react';

const Cast = ({ cast, numberOfCast, movieTitle, Width, Height, Color }) => {
    const castCount = numberOfCast || 4; // Default to 4 if not provided
    const Title = movieTitle;
    const cardWidth = Width || '5vw'
    const cardHeight = Height || '14vh';
    const textColor = Color || 'white';

    const [openCast, setOpenCast] = useState(false);
    const handleOpen = () => setOpenCast(true);
    const handleClose = () => setOpenCast(false);

    return (
        <Box>  
        <Typography sx={{position: 'relative', color:'white', fontFamily:'Sora', mb:1 }}> 
            Cast 
        </Typography>
        <Box 
            sx={{display:'flex', gap:1, zIndex:3}}>
            {cast.slice(0, castCount).filter((actor) => actor.profile_path)  // Filering out actors without profile images within first 4 actors
            .map(actor => (
            <Box key={actor.id}>
                <img
                src={ `https://image.tmdb.org/t/p/w500${actor.profile_path}` }
                alt={actor.name}
                style={{width: cardWidth, height: cardHeight, borderRadius: 5, objectFit: 'cover'}}
                />
                <Typography sx={{textAlign:'center', lineHeight:1, color:textColor,  fontSize:'0.75rem', fontFamily:'Sora', fontWeight: 550}}>
                    {actor.name.split(' ')[0]}
                    <br />
                    {actor.name.split(' ')[1]}
                </Typography>
            </Box>
            ))}
            <Button
            onClick={handleOpen}
            sx={{  width: cardWidth, height:cardHeight, borderRadius:5, textTransform: 'none', fontSize: '0.75rem', fontFamily:'Sora', backgroundColor:'#ccc', color:'black'
            }}>
                View All
            </Button>
        </Box>

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
            Cast of {Title}
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

export default Cast;