import { CardContent, Typography, Card, LinearProgress, Box, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';

const SingleImage = ({ image, onClick }) => {
    const [progress, setProgress] = useState(0);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress((image.confidence || 0) * 100);
        }, 300);

        return () => clearTimeout(timer);
    }, [image]);

    if (!image) return null;

    const formattedConfidence = `${progress.toFixed(2)}%`;

    const getProgressBarColor = (title) => {
        return title?.toLowerCase().includes('infected') ? 'error' : 'success';
    };

    const handleImageError = () => {
        setImageError(true);
        image.src = '';
    };

    return (
        <Card
            sx={{
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                transition: "opacity 500ms ease-in-out",
                cursor: 'pointer',
                width: '100%',
                minHeight: imageError ? '150px' : 'auto',
            }}
            onClick={() => onClick(image)}
        >
            {!imageError && image.src ? (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '3 / 3',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        component="img"
                        src={image.src}
                        alt={image.title || 'Image preview'}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={handleImageError}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        minHeight: '50px',
                    }}
                >
                    <Typography variant="body2" color="textSecondary" align="center">
                        Image not available
                    </Typography>
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1, padding: '8px' }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {image.title}
                </Typography>

                <Box sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        Confidence:
                    </Typography>
                    <Tooltip
                        title={<Typography sx={{ fontSize: '1.25rem' }}>{formattedConfidence}</Typography>}
                        arrow
                    >
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                transition: 'width 1s ease, background-color 1s ease',
                            }}
                            color={getProgressBarColor(image.title)}
                        />
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SingleImage;
