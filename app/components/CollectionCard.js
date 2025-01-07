import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import { collectionCardStyles } from '../styles/CollectionCardStyles';
import transcriptTypes from '../config/transcriptTypes.json';

const CollectionCard = ({ 
    type,
    transcripts,
    hashtags,
    onItemClick,
    onMoreClick 
}) => {
    const typeConfig = transcriptTypes[type];
    const { color } = typeConfig;

    return (
        <Paper
            elevation={0}
            sx={collectionCardStyles.paper}
        >
            {/* Header */}
            <Box
                sx={{
                    ...collectionCardStyles.header.base,
                    bgcolor: (theme) => alpha(theme.palette[color].main, typeConfig.backgroundOpacity)
                }}
            >
                {/* Left Cell - Icon */}
                <Box sx={collectionCardStyles.header.iconCell}>
                    <Avatar
                        sx={{
                            ...collectionCardStyles.header.avatar,
                            bgcolor: (theme) => alpha(theme.palette[color].main, typeConfig.avatarBackgroundOpacity),
                            color: `${color}.main`
                        }}
                    >
                        <typeConfig.icon sx={{ fontSize: '2.8rem' }} />
                    </Avatar>
                </Box>

                {/* Middle Cell - Content */}
                <Box sx={collectionCardStyles.header.contentCell}>
                    <Typography 
                        variant="h6" 
                        sx={collectionCardStyles.header.title}
                    >
                        {typeConfig.label}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={collectionCardStyles.header.subtitle}
                    >
                        {transcripts.length} transcripts
                    </Typography>
                </Box>

                {/* Right Cell - Action */}
                <Box sx={collectionCardStyles.header.actionCell}>
                    <IconButton
                        size="small"
                        onClick={onMoreClick}
                        sx={{
                            ...collectionCardStyles.header.actionButton,
                            color: `${color}.main`,
                            '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette[color].main, typeConfig.hoverBackgroundOpacity),
                            },
                        }}
                    >
                        <MoreVertIcon sx={collectionCardStyles.header.actionIcon} />
                    </IconButton>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={collectionCardStyles.content.wrapper}>
                {/* AI-Generated Hashtags */}
                <Box sx={collectionCardStyles.content.section}>
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={collectionCardStyles.content.sectionTitle}
                    >
                        Popular Topics
                    </Typography>
                    <Box sx={collectionCardStyles.content.chipContainer}>
                        {hashtags.map((tag) => (
                            <Chip 
                                key={tag}
                                label={tag} 
                                size="small"
                                sx={collectionCardStyles.content.chip(color)}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Recent Items */}
                <Box>
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={collectionCardStyles.content.sectionTitle}
                    >
                        Recent Items
                    </Typography>
                    <Stack sx={collectionCardStyles.content.itemList}>
                        {transcripts.slice(0, 3).map((transcript) => (
                            <Box
                                key={transcript.id}
                                onClick={() => onItemClick(transcript)}
                                sx={collectionCardStyles.content.listItem(color)}
                            >
                                <Box sx={{ display: 'flex', gap: 1.5, minWidth: 0 }}>
                                    <DescriptionIcon 
                                        sx={{
                                            ...collectionCardStyles.content.itemIcon,
                                            color: `${color}.main`
                                        }}
                                    />
                                    <Box sx={collectionCardStyles.content.itemContent}>
                                        <Typography 
                                            variant="body2"
                                            sx={collectionCardStyles.content.itemTitle}
                                        >
                                            {transcript.title}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={collectionCardStyles.content.itemMeta}
                                        >
                                            {new Date(transcript.date).toLocaleDateString()} • {transcript.duration}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={transcript.status}
                                    size="small"
                                    color={transcript.status === 'Complete' ? 'success' : 'warning'}
                                    variant="outlined"
                                    sx={collectionCardStyles.content.statusChip}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default CollectionCard; 