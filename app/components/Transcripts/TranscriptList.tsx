"use client";

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Chip,
    Divider,
    Tooltip,
    alpha,
} from '@mui/material';
import {
    Star,
    MoreVert,
    CalendarToday,
} from '@mui/icons-material';
import * as MuiIcons from '@mui/icons-material';
import type { Transcript } from '@/src/types/transcript';

interface TranscriptListProps {
    transcripts: Transcript[];
    isLoading?: boolean;
    onFavoriteClick?: (id: string) => void;
    onMoreClick?: (id: string) => void;
    onClick?: (id: string) => void;
}

export default function TranscriptList({ 
    transcripts,
    isLoading,
    onFavoriteClick,
    onMoreClick,
    onClick
}: TranscriptListProps) {
    return (
        <Stack spacing={2}>
            {transcripts.map((transcript) => {
                return (
                    <Card
                        key={transcript.id}
                        onClick={() => onClick?.(transcript.id)}
                        sx={{
                            cursor: 'pointer',
                            position: 'relative',
                            borderLeft: '6px solid',
                            borderLeftColor: 'primary.main',
                            bgcolor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 200,
                            borderRadius: 2,
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                            {/* Title and Date */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.75,
                                    minWidth: 0
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {transcript.title}
                                </Typography>
                                <Stack 
                                    direction="row" 
                                    spacing={0.75} 
                                    alignItems="center"
                                >
                                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                    >
                                        {transcript.date}
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <MuiIcons.Description sx={{ color: 'primary.main', fontSize: 24 }} />
                            </Box>
                        </Box>

                        <Divider />

                        {/* Body */}
                        <CardContent sx={{ p: 2, flex: 1 }}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1.5,
                                }}
                            >
                                {transcript.summary || 'No summary available for this transcript.'}
                            </Typography>
                        </CardContent>

                        <Divider />

                        {/* Footer */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, bgcolor: 'grey.50' }}>
                            {/* Type Chip */}
                            <Chip
                                label={transcript.type}
                                size="small"
                                sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    borderRadius: 1.5,
                                    px: 1
                                }}
                            />

                            {/* Actions */}
                            <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                                <Tooltip title={transcript.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onFavoriteClick?.(transcript.id);
                                        }}
                                        sx={{
                                            color: transcript.isFavorite ? 'warning.main' : 'text.secondary',
                                        }}
                                    >
                                        <Star sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="More options">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMoreClick?.(transcript.id);
                                        }}
                                        sx={{
                                            color: 'text.secondary',
                                        }}
                                    >
                                        <MoreVert sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Card>
                );
            })}
        </Stack>
    );
} 