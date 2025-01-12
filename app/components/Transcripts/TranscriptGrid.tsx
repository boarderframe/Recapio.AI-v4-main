"use client";

import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { Transcript } from '../../hooks/useTranscripts';

interface TranscriptGridProps {
    transcripts: Transcript[];
    onEdit?: (transcript: Transcript) => void;
    onDelete?: (transcript: Transcript) => void;
}

export default function TranscriptGrid({ transcripts, onEdit, onDelete }: TranscriptGridProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedTranscript, setSelectedTranscript] = React.useState<Transcript | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transcript: Transcript) => {
        setAnchorEl(event.currentTarget);
        setSelectedTranscript(transcript);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTranscript(null);
    };

    const handleEdit = () => {
        if (selectedTranscript && onEdit) {
            onEdit(selectedTranscript);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedTranscript && onDelete) {
            onDelete(selectedTranscript);
        }
        handleMenuClose();
    };

    const getStatusIcon = (status: Transcript['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: 'success.main' }} />;
            case 'failed':
                return <ErrorIcon sx={{ color: 'error.main' }} />;
            case 'processing':
                return <RefreshIcon sx={{ color: 'info.main' }} />;
            default:
                return null;
        }
    };

    return (
        <Grid container spacing={3}>
            {transcripts.map((transcript) => (
                <Grid item xs={12} sm={6} md={4} key={transcript.id}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            '&:hover': {
                                boxShadow: 3,
                            },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" component="h2" noWrap>
                                    {transcript.title}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, transcript)}
                                    sx={{ ml: 1 }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDistanceToNow(new Date(transcript.createdAt), { addSuffix: true })}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {getStatusIcon(transcript.status)}
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ ml: 0.5, textTransform: 'capitalize' }}
                                >
                                    {transcript.status}
                                </Typography>
                            </Box>

                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    mb: 2
                                }}
                            >
                                {transcript.content}
                            </Typography>
                        </CardContent>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleEdit}>Edit</MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
                        </Menu>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
} 