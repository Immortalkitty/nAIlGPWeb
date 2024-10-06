import React, { useEffect, useRef } from 'react';
import { Box, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeAppTitles from '../components/homeScreen/HomeAppTitles';

const homeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const HomeScreen = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      navigate('/prediction', { state: { file } });
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={homeVariants}
      style={{ width: '100%' }}
    >
      <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
          <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HomeAppTitles />
          </Box>
          <Stack sx={{ pt: 4 }} direction="row" justifyContent="center">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-file"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button
              sx={{ background: '#0CC0DF' }}
              variant="contained"
              onClick={handleClick}
              aria-label="Upload and Analyze"
            >
              Upload and Analyze
            </Button>
          </Stack>
        </Container>
      </Container>
    </motion.div>
  );
}

export default HomeScreen;
