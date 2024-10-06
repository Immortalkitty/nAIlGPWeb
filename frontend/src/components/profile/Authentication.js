import React, {useEffect, useRef, useState} from 'react';
import {Box, Container, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';
import axios from 'axios';
import UserAuthForm from './UserAuthForm';
import config from "../../utils/config.js";
import {encryptData} from '../../utils/encryptData';

const Authentication = ({setIsLoggedIn, setUsername}) => {
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authMode, setAuthMode] = useState('login');
    const [loading, setLoading] = useState(false);

    const nickRef = useRef(null);
    const passwordRef = useRef(null);

    const validateUsername = (username) => /^[a-zA-Z0-9_-]{3,20}$/.test(username);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(password);

    const handleAuthSubmit = async () => {
        if (!nick || !validateUsername(nick)) {
            setError('Please enter a valid username. It must be between 3 and 20 characters long.');
            return;
        }

        if (authMode === 'register') {
            if (!password || !validatePassword(password)) {
                setError('Password must be at least 8 characters long, include a number, and a special character.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            await handleRegister();
        } else {
            if (!password) {
                setError('Please enter a password.');
                return;
            }

            await handleLogin();
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const encryptedEmail = encryptData(nick);
            const encryptedPassword = encryptData(password);

            await axios.post(`${config.API_BASE_URL}/auth/register`, {
                email: encryptedEmail,
                password: encryptedPassword
            }, {withCredentials: true});
            await handleLogin();
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const encryptedEmail = encryptData(nick);
            const encryptedPassword = encryptData(password);

            await axios.post(`${config.API_BASE_URL}/auth/login`, {
                email: encryptedEmail,
                password: encryptedPassword
            }, {withCredentials: true});
            setIsLoggedIn(true);
            const {data: {username}} = await axios.get(`${config.API_BASE_URL}/auth/get-username`, {withCredentials: true});
            setUsername(username);
        } catch (error) {
            setError(error.response?.status === 401 ? 'Password is incorrect' : error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = (event, newMode) => {
        if (newMode) {
            setAuthMode(newMode);
            setError('');
            if (newMode === 'login') {
                setConfirmPassword('');
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAuthSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [nick, password, confirmPassword]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="authentication-form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                    hidden: {opacity: 0, y: 20},
                    visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
                    exit: {opacity: 0, y: -20, transition: {duration: 0.5}},
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{padding: 2, borderRadius: 2, textAlign: 'center', position: 'relative'}}>
                        <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
                            <ToggleButtonGroup
                                color="primary"
                                value={authMode}
                                exclusive
                                onChange={handleModeChange}
                                sx={{width: '100%', maxWidth: 300}}
                            >
                                <ToggleButton value="login" sx={{flex: 1}}>Login</ToggleButton>
                                <ToggleButton value="register" sx={{flex: 1}}>Register</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <UserAuthForm
                            nick={nick}
                            password={password}
                            setNick={setNick}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            handleSubmit={handleAuthSubmit}
                            error={error}
                            buttonLabel="Submit"
                            nickRef={nickRef}
                            passwordRef={passwordRef}
                            authMode={authMode}
                            setError={setError}
                            loading={loading}
                        />
                    </Box>
                </Container>
            </motion.div>
        </AnimatePresence>
    );
};

export default Authentication;
