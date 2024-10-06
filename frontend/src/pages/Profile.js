import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import UserHistory from '../components/profile/UserHistory';
import Authentication from '../components/profile/Authentication';
import config from '../utils/config';  // Import config for API base path

const Profile = () => {
    const { isLoggedIn, setIsLoggedIn, username, setUsername } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/auth/check-session`, { withCredentials: true });
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                    const usernameResponse = await axios.get(`${config.API_BASE_URL}/auth/get-username`, { withCredentials: true });
                    setUsername(usernameResponse.data.username);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('error checking session:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, [setIsLoggedIn, setUsername]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
    };

    if (loading) {
        return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress />
        </Box>
    );
    }

    return (
        <Box sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
                {isLoggedIn ? (
                    <motion.div
                        key="user-history"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <UserHistory username={username} isLoggedIn={isLoggedIn} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="authentication"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <Authentication setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
                    </motion.div>
                )}
            </AnimatePresence>

            {showScroll && (
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToTop}
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    <KeyboardArrowUp />
                </Fab>
            )}
        </Box>
    );
};

export default Profile;
