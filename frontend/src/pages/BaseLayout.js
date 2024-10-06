import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuBar from "../components/baseLayout/MenuBar";
import HelpPopup from '../components/baseLayout/HelpPopup';
import axios from 'axios';
import config from "../utils/config";

const theme = createTheme();

function BaseLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/auth/check-session`, { withCredentials: true });
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('error checking session:', error);
        setIsLoggedIn(false);
        navigate('/');
      }
    };

    const fetchUsername = async () => {
      try {
        const usernameResponse = await axios.get(`${config.API_BASE_URL}/auth/get-username`, { withCredentials: true });
        if (usernameResponse.status === 200) {
          setUsername(usernameResponse.data.username);
        }
      } catch (error) {
        console.error('error fetching username:', error);
      }
    };

    checkLoginStatus();
    fetchUsername();
  }, [navigate]);

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  const handleHelpClose = () => {
    setShowHelp(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={styles.rootContainer}>
        <MenuBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          onHelpClick={handleHelpClick}
          username={username}
        />
        <Box sx={styles.mainContent} component="main">
          <Outlet context={{ isLoggedIn, setIsLoggedIn, username, setUsername }} />
          {children}
        </Box>
      </Box>
      <HelpPopup open={showHelp} onClose={handleHelpClose} />
    </ThemeProvider>
  );
}

export default BaseLayout;

const styles = {
  rootContainer: {
    minHeight: '100vh',
    flexDirection: 'column',
    display: 'flex',
    background: 'linear-gradient(to right, #e0f7fa, #80deea)',
  },
  mainContent: {
    p: 6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};
