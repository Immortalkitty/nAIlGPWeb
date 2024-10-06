import React, {useState} from 'react';
import {Box, Button, CircularProgress, Container, Paper, Stack, Typography} from '@mui/material';
import ResultsGallery from '../shared/ResultsGallery';
import SingleImage from '../shared/SingleImage';
import {CSSTransition} from 'react-transition-group';
import ZoomPictureModal from '../shared/ZoomPictureModal';
import ErrorPageContent from "../error/ErrorPageContent";

const PredictionComponent = ({image, results, error, isImageBeingProcessed, handleUploadNextClick, fileInputRef}) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        if (image && image.src) {
            setSelectedImage(image);
        } else {
            console.error("Image not found or invalid");
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const isImageValid = selectedImage && selectedImage.src;

    return (
        <Container disableGutters sx={{flex: "1", display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <Container sx={{pt: 8, pb: 6}} maxWidth="sm">
                <Box sx={{
                    minHeight: "350px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "100%",
                }}>
                    {error ? (
                        <ErrorPageContent message={error} title={"Prediction failed"}/>
                    ) : (
                        <>
                            {isImageBeingProcessed && !image && <CircularProgress/>}
                            {image && (
                                <CSSTransition
                                    in={!!image}
                                    classNames="my-node"
                                    timeout={{
                                        appear: 1000,
                                        enter: 1000,
                                        exit: 1000,
                                    }}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        maxWidth: '450px',
                                        margin: '0 auto',
                                    }}>
                                        {image.src ? (
                                            <SingleImage image={image} onClick={handleImageClick}/>
                                        ) : (
                                            <Typography color="error" align="center">Image not found</Typography>
                                        )}
                                    </Box>
                                </CSSTransition>
                            )}
                        </>
                    )}
                </Box>
            </Container>

            <Stack sx={{pt: 2, alignItems: 'center'}} direction="row" justifyContent="center">
                <input
                    accept="image/*"
                    style={{display: 'none'}}
                    id="upload-next-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadNextClick}
                />
                <Button sx={{background: '#0CC0DF'}} variant="contained" onClick={() => fileInputRef.current.click()}>
                    Upload Next Image
                </Button>
            </Stack>

            {!!results.length && (
                <Container sx={{py: 6}}>
                    <Typography sx={{p: 4}} align="center" variant="h4" component="h3">
                        Recent results:
                    </Typography>
                    <Paper elevation={3} sx={{p: 4, background: '#0CC0DF'}}>
                        <ResultsGallery results={results}/>
                    </Paper>
                </Container>
            )}

            {selectedImage && (
                <ZoomPictureModal selectedImage={selectedImage} handleClose={handleClose} isImageValid={isImageValid}/>
            )}
        </Container>
    );
};

export default PredictionComponent;
