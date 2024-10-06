import React, { useState } from 'react';
import { Grid } from '@mui/material';
import SingleImage from './SingleImage';
import ZoomPictureModal from './ZoomPictureModal';

const ResultsGallery = ({ results }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [willChangeImage, setWillChangeImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setWillChangeImage(image.id);
    };

    const handleClose = () => {
        setSelectedImage(null);
        setWillChangeImage(null);
    };

    const isImageValid = selectedImage?.src;

    return (
        <>
            <Grid container spacing={4}>
                {results?.length ? (
                    results.map((result) => (
                        <Grid
                            item
                            key={result.id}
                            xs={12}
                            sm={6}
                            md={4}
                            sx={willChangeImage === result.id ? { willChange: 'transform, opacity' } : {}}
                        >
                            <SingleImage image={result} onClick={() => handleImageClick(result)} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <p>No results available.</p>
                    </Grid>
                )}
            </Grid>

            {selectedImage && (
                <ZoomPictureModal
                    selectedImage={selectedImage}
                    handleClose={handleClose}
                    isImageValid={isImageValid}
                />
            )}
        </>
    );
};

export default ResultsGallery;
