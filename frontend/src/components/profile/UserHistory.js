import React, {useEffect, useState, useRef} from 'react';
import {Box, Container, Paper, Typography, Button, CircularProgress} from '@mui/material';
import {motion} from 'framer-motion';
import axios from 'axios';
import ResultsGallery from '../shared/ResultsGallery';
import config from '../../utils/config';
import {useNavigate} from "react-router-dom";

const UserHistory = ({isLoggedIn, username}) => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        if (isLoggedIn) {
            resetHistory();
        }
    }, [isLoggedIn]);

    const resetHistory = () => {
        setResults([]);
        setPage(1);
        setHasMore(true);
        fetchPredictions(1);
    };

    const fetchPredictions = async (pageNumber) => {
        if (isFetching.current || !hasMore) return;

        isFetching.current = true;
        setLoading(true);

        try {
            const {data} = await axios.get(`${config.API_BASE_URL}/predictions/user-predictions?page=${pageNumber}&limit=10`, {withCredentials: true});
            const predictions = data.predictions.map(({image_src, title, confidence, id}) => ({
                src: image_src, title, confidence, id
            }));

            setResults((prevResults) => [...prevResults, ...predictions]);
            setHasMore(data.has_more);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching predictions:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !isFetching.current) {
            fetchPredictions(page + 1);
        }
    };

    return (
        <Container maxWidth="lg">
            <motion.div
                key="user-history"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0, transition: {duration: 0.5}}}
                exit={{opacity: 0, y: -20, transition: {duration: 0.5}}}
            >
                <Box sx={{padding: 1}}>
                    <Typography variant="h3" align="center" sx={{marginBottom: 1, marginTop: 3}}>
                        Welcome, {username}!
                    </Typography>

                    {results.length > 0 ? (
                        <>
                            <Typography sx={{marginBottom: 6}} align="center" variant="h4" component="h3">
                                Your Previous Predictions:
                            </Typography>
                            <Paper elevation={3} sx={{p: 4, background: '#0CC0DF'}}>
                                <ResultsGallery results={results}/>
                                {loading && <CircularProgress/>}
                                {hasMore && (
                                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                                        <Button onClick={handleLoadMore} variant="contained"
                                                sx={{background: '#0CC0DF'}}>
                                            Load More
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </>
                    ) : (
                        <Paper elevation={3} sx={{p: 6, mt: 4, textAlign: 'center', background: '#0CC0DF'}}>
                            <Typography variant="h4" component="h3" sx={{mt: 2}}>
                                No Previous Predictions
                            </Typography>
                            <Typography variant="h5" color="textSecondary" sx={{mt: 1}}>
                                It seems like you haven't made any predictions yet. Go to the homepage to start
                                predicting.
                            </Typography>
                            <Button
                                sx={{background: '#0CC0DF', mt: 4, padding: '8px 24px'}}
                                variant="contained"
                                onClick={() => navigate('/')}
                                aria-label="Go to Homepage"
                            >
                                Go to Homepage
                            </Button>
                        </Paper>
                    )}
                </Box>
            </motion.div>
        </Container>
    );
};

export default UserHistory;
