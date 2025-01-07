import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function BaseModelModal({ open, onClose, children }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="model-modal"
            aria-describedby="model-details"
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: (theme) => theme.zIndex.modal,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: '600px',
                    overflow: 'auto',
                    '&:focus': {
                        outline: 'none',
                    },
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'text.primary',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {children}
            </Box>
        </Modal>
    );
} 