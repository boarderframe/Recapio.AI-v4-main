import React from 'react';
import { 
    Box,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Divider,
} from '@mui/material';
import {
    AccessTime as RecentIcon,
    Star as StarIcon,
    Collections as CollectionsIcon,
    Tag as TagIcon,
    Description as TranscriptsIcon,
} from '@mui/icons-material';

interface SidebarProps {
    selectedType: string;
    onTypeSelect: (typeId: string) => void;
}

const navigationItems = [
    { id: 'recent', name: 'Recent', icon: RecentIcon, count: 5 },
    { id: 'favorites', name: 'Favorites', icon: StarIcon, count: 3 },
    { id: 'collections', name: 'Collections', icon: CollectionsIcon, count: 4 },
    { id: 'tags', name: 'Tags', icon: TagIcon, count: 8 },
    { id: 'all', name: 'All Transcripts', icon: TranscriptsIcon, count: 12 },
];

export default function Sidebar({ selectedType, onTypeSelect }: SidebarProps) {
    return (
        <Box 
            sx={{ 
                width: 280,
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Box sx={{ p: 2, pb: 1.5 }}>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ 
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        pl: 1,
                    }}
                >
                    Browse Transcripts
                </Typography>
            </Box>
            <List 
                component="nav"
                sx={{
                    px: 1,
                    '& .MuiListItemButton-root': {
                        borderRadius: 1.5,
                        mb: 0.5,
                        transition: 'all 0.2s ease-in-out',
                    },
                }}
            >
                {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = selectedType === item.id;
                    
                    return (
                        <React.Fragment key={item.id}>
                            {index === navigationItems.length - 1 && (
                                <Divider sx={{ my: 1 }} />
                            )}
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => onTypeSelect(item.id)}
                                sx={{
                                    minHeight: 44,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                        '& .MuiTypography-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: 36,
                                        color: isSelected ? 'inherit' : 'primary.main',
                                    }}
                                >
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.name}
                                    secondary={`${item.count} items`}
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: isSelected ? 600 : 500,
                                    }}
                                    secondaryTypographyProps={{
                                        fontSize: '0.75rem',
                                        color: isSelected ? 'primary.contrastText' : 'text.secondary',
                                        sx: { opacity: isSelected ? 0.9 : 0.7 }
                                    }}
                                />
                            </ListItemButton>
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
} 