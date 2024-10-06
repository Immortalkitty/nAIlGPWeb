import React, { useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const UserAuthForm = ({
    nick,
    password,
    setNick,
    setPassword,
    handleSubmit,
    error,
    buttonLabel,
    nickRef,
    passwordRef,
    confirmPassword,
    setConfirmPassword,
    authMode,
    setError,
    loading, // Add loading prop
}) => {
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        if (authMode === 'register' && confirmPasswordRef.current) {
            confirmPasswordRef.current.focus();
        }
    }, [authMode]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowDown') {
                if (document.activeElement === nickRef.current) {
                    passwordRef.current?.focus();
                } else if (authMode === 'register' && document.activeElement === passwordRef.current) {
                    confirmPasswordRef.current?.focus();
                }
            } else if (e.key === 'ArrowUp') {
                if (authMode === 'register' && document.activeElement === confirmPasswordRef.current) {
                    passwordRef.current?.focus();
                } else if (document.activeElement === passwordRef.current) {
                    nickRef.current?.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [authMode]);

    const setCaretPositionAtEnd = (ref) => {
        if (ref.current) {
            const length = ref.current.value.length;
            setTimeout(() => {
                ref.current.setSelectionRange(length, length);
            }, 0);
        }
    };

    const errorVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: 'easeIn' } },
    };

    return (
        <Box sx={{ flex: 1, marginX: 2 }}>
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={nick}
                onChange={(e) => {
                    setNick(e.target.value);
                    setError('');
                }}
                onFocus={() => setCaretPositionAtEnd(nickRef)}
                inputRef={nickRef}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                }}
                onFocus={() => setCaretPositionAtEnd(passwordRef)}
                inputRef={passwordRef}
            />

            <AnimatePresence>
                {authMode === 'register' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            onFocus={() => setCaretPositionAtEnd(confirmPasswordRef)}
                            inputRef={confirmPasswordRef}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                onClick={handleSubmit}
                disabled={loading} // Disable button when loading
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : buttonLabel} {/* Show spinner if loading */}
            </Button>

            <Box sx={{ mt: 2, height: '3.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            key="error"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={errorVariants}
                        >
                            <Typography
                                color="error"
                                align="center"
                                sx={{
                                    fontSize: '1.2rem',
                                    maxWidth: '100%',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    px: 2,
                                }}
                            >
                                {error}
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default UserAuthForm;
