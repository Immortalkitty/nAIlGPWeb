import { Box, Typography, Modal, LinearProgress, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ZoomPictureModal = ({ selectedImage, handleClose, isImageValid }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (selectedImage) {
            setImageError(false);
        }
    }, [selectedImage]);

    const handleImageError = () => setImageError(true);

    const getProgressBarColor = (title) => title?.toLowerCase().includes('infected') ? 'error' : 'success';

    const modalSize = isImageValid && !imageError ? { width: '80vw', height: '80vh' } : { width: '30vw', height: 'auto' };

    return (
        <Modal
            open={!!selectedImage}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            keepMounted
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            borderRadius: 2,
                            ...modalSize,
                        }}
                    >
                        <Typography id="modal-title" variant="h4" align="center" gutterBottom>
                            {selectedImage.title || 'Image Preview'}
                        </Typography>

                        {isImageValid && !imageError ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '65vh',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={selectedImage.src}
                                    alt={selectedImage.title || 'Image preview not available'}
                                    sx={{
                                        width: 'auto',
                                        height: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                    }}
                                    onError={handleImageError}
                                />
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                Image not available
                            </Typography>
                        )}

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Box sx={{ width: '60%' }}>
                                <Typography variant="body4" color="textSecondary" sx={{ fontSize: '1.25rem' }}>
                                    Confidence:
                                </Typography>
                                <Tooltip
                                    title={<Typography sx={{ fontSize: '1.25rem' }}>{((selectedImage.confidence || 0) * 100).toFixed(2)}%</Typography>}
                                    arrow
                                >
                                    <LinearProgress
                                        variant="determinate"
                                        value={(selectedImage.confidence || 0) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            transition: 'width 1s ease, background-color 1s ease',
                                        }}
                                        color={getProgressBarColor(selectedImage.title)}
                                    />
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>
            )}
        </Modal>
    );
};

export default ZoomPictureModal;
