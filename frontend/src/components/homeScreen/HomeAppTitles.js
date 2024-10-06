import React from 'react';
import Typography from '@mui/material/Typography';

export default function HomeAppTitles() {
    return (
        <div>
            <Typography
                component="h2"
                variant="h2"
                align="center"
                color="text.primary"
                noWrap
            >
                Web app for preliminary
            </Typography>
            <Typography
                component="h2"
                variant="h2"
                align="center"
                color="text.primary"
                noWrap
                gutterBottom
            >
               diagnosis of nail fungus
            </Typography>
            <Typography component="h5" variant="h5" align="center" color="text.secondary" paragraph>
                Upload a photo to test for symptoms of nail fungus
            </Typography>
        </div>
    );
}
