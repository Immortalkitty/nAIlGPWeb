import React, {useEffect, useRef, useState} from 'react';
import {Box, Container, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';
import axios from 'axios';
import UserAuthForm from '../components/UserAuthForm';

const Authentication = ({setIsLoggedIn, setUsername}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authMode, setAuthMode] = useState('login');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Regex for email validation
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return emailRegex.test(email);
    };

    // Password validation logic
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // Handle form submission
    const handleAuthSubmit = async () => {
        // Common validation for both login and registration
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (authMode === 'register') {
            // Registration-specific validations
            if (!password || !validatePassword(password)) {
                setError('Password must be at least 8 characters long, include a number, and a special character.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            // Registration logic
            await handleRegister();
        } else {
            // Login-specific validations
            if (!password) {
                setError('Please enter a password.');
                return;
            }

            // Login logic
            await handleLogin();
        }
    };

    // Register user
    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/auth/register', {email, password}, {withCredentials: true});
            await handleLogin();  // Automatically log in after registration
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    // Login user
    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:5000/auth/login', {email, password}, {withCredentials: true});
            setIsLoggedIn(true);
            const usernameResponse = await axios.get('http://localhost:5000/auth/get-username', {withCredentials: true});
            setUsername(usernameResponse.data.username);
        } catch (error) {
            // If error is related to incorrect password, set the specific message
            if (error.response?.status === 401) {
                setError('Password is incorrect');
            } else {
                setError(error.response?.data?.error || 'Login failed');
            }
        }
    };

    // Handle auth mode toggle
    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setAuthMode(newMode);
            setError('');  // Clear any previous errors when switching modes

            // Clear confirmPassword field when switching to login mode
            if (newMode === 'login') {
                setConfirmPassword(''); // Clear confirmPassword when switching to login mode
            }
        }
    };

    // Add event listener to handle the "Enter" key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent the default Enter key behavior
                handleAuthSubmit();  // Call the submit function when "Enter" is pressed
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [email, password, confirmPassword]); // Depend on email, password, and confirmPassword so the latest values are used

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

                        {/* Form component */}
                        <UserAuthForm
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            handleSubmit={handleAuthSubmit}
                            error={error}
                            buttonLabel="Submit"
                            emailRef={emailRef}
                            passwordRef={passwordRef}
                            authMode={authMode}
                            setError={setError}  // Pass setError to clear errors on input change
                        />
                    </Box>
                </Container>
            </motion.div>
        </AnimatePresence>
    );
};

export default Authentication;
