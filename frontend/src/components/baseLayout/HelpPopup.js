import React from 'react';
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import helpPopupContent from './content';


const HelpPopup = ({open, onClose}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <DialogTitle>
                {helpPopupContent.title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    {helpPopupContent.description}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <Box sx={{mx: 2, textAlign: 'center'}}>
                        <Box
                            component="img"
                            src="/logo192.png"
                            alt="example1"
                            sx={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}
                        />
                        <Typography variant="h6" align="center">{helpPopupContent.correctLabel}</Typography>
                    </Box>
                    <Box sx={{mx: 2, textAlign: 'center'}}>
                        <Box
                            component="img"
                            src="/logo192.png"
                            alt="example1"
                            sx={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}
                        />
                        <Typography variant="h6" align="center">{helpPopupContent.incorrectLabel}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default HelpPopup;
