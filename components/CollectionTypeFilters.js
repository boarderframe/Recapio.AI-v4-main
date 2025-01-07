import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { alpha } from '@mui/material/styles';
import transcriptTypes from '@/app/config/transcriptTypes.json';

const CollectionTypeFilters = ({ selectedType, onTypeChange }) => {
    // Group types by category
    const typesByCategory = Object.entries(transcriptTypes).reduce((acc, [key, value]) => {
        const category = value.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ key, ...value });
        return acc;
    }, {});

    return (
        <Box sx={{ mb: 3, overflowX: 'auto', py: 1 }}>
            <ToggleButtonGroup
                value={selectedType}
                exclusive
                onChange={(e, newType) => onTypeChange(newType)}
                aria-label="collection type filter"
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    '& .MuiToggleButtonGroup-grouped': {
                        border: 1,
                        borderColor: 'divider',
                        mx: 0
                    }
                }}
            >
                <ToggleButton 
                    value="all"
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '8px !important',
                        typography: 'body2',
                        fontWeight: 500,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.light'
                            }
                        }
                    }}
                >
                    All Types
                </ToggleButton>
                {Object.entries(typesByCategory).map(([category, types]) => (
                    <Box 
                        key={category}
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:not(:first-of-type)': {
                                ml: 2,
                                pl: 2,
                                borderLeft: '1px solid',
                                borderColor: 'divider'
                            }
                        }}
                    >
                        {types.map(({ key, color, label }) => (
                            <ToggleButton
                                key={key}
                                value={key}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderRadius: '8px !important',
                                    typography: 'body2',
                                    fontWeight: 500,
                                    color: `${color}.main`,
                                    '&.Mui-selected': {
                                        bgcolor: (theme) => alpha(theme.palette[color].main, 0.08),
                                        color: `${color}.main`,
                                        borderColor: `${color}.main`,
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette[color].main, 0.12)
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette[color].main, 0.04)
                                    }
                                }}
                            >
                                {label}
                            </ToggleButton>
                        ))}
                    </Box>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};

export default CollectionTypeFilters; 