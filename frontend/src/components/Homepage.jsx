// Homepage.js
import React from 'react';
import { Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { grey } from '@mui/material/colors';

const Homepage = () => {
  
  return (
    <Box sx={styles.container}>
      {/* Carousel */}
      <Box sx={styles.carouselContainer}>
        <Carousel 
          autoPlay 
          interval={3000} 
          infiniteLoop 
          showThumbs={false} 
          showArrows={true} 
          renderArrowPrev={(clickHandler) => (
            <div className="custom-arrow-left" onClick={clickHandler} style={styles.arrowLeft}>←</div>
          )}
          renderArrowNext={(clickHandler) => (
            <div className="custom-arrow-right" onClick={clickHandler} style={styles.arrowRight}>→</div>
          )}
        >
          <div>
            <div style={styles.imageWrapper}>
              <img src="/hospi1.jpg" alt="hospital 1" style={styles.carouselImage} />
            </div>
          </div>
          <div>
            <div style={styles.imageWrapper}>
              <img src="/hospi2.jpg" alt="Hospital 2" style={styles.carouselImage} />
            </div>
          </div>
          <div>
            <div style={styles.imageWrapper}>
              <img src="/hospi3.jpg" alt="Hospital 3" style={styles.carouselImage} />
            </div>
          </div>
          <div>
            <div style={styles.imageWrapper}>
              <img src="/hospi4.jpg" alt="Hospital 4" style={styles.carouselImage} />
            </div>
          </div>
          <div>
            <div style={styles.imageWrapper}>
              <img src="/hospi5.jpg" alt="Hospital 5" style={styles.carouselImage} />
            </div>
          </div>
        </Carousel>
      </Box>
    </Box>
  );
};

// Styles for the components
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    padding: '20px',
    position: 'relative',
  },
  carouselContainer: {
    width: '100%',
    maxWidth: '1200px', 
    marginTop: '20px',  
    marginLeft: 'auto',  
    marginRight: 'auto',
    position: 'relative',
    backgroundColor: grey[100], 
    borderRadius: '8px', 
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100vw',        
    height: '90vh',        
    objectFit: 'cover',    
  },
  arrowLeft: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    fontSize: '30px',    
    color: '#fff',
    zIndex: 10,          
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: '12px',
    borderRadius: '50%',  
  },
  arrowRight: {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    fontSize: '30px',    
    color: '#fff',       
    zIndex: 10,          
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: '12px',
    borderRadius: '50%',  
  }
};

export default Homepage;
