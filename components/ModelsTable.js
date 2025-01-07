"use client";

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import OpenAIModelModal from './modals/OpenAIModelModal';
import AnthropicModelModal from './modals/AnthropicModelModal';
import GeminiModelModal from './modals/GeminiModelModal';

export default function ModelsTable({ 
    models = [], 
    filters,
    onFilterChange,
    provider,
    availableFilters = { types: [], statuses: [], years: [] }
}) {
    const safeModels = Array.isArray(models) ? models : [];
    const [selectedModel, setSelectedModel] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleModelClick = (model) => {
        console.log('Model clicked:', model);
        setSelectedModel(model);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedModel(null);
    };

    const getModalComponent = () => {
        if (!selectedModel) return null;

        const modalProps = {
            open: modalOpen,
            onClose: handleCloseModal,
            model: selectedModel
        };

        switch (provider) {
            case 'OpenAI':
                return <OpenAIModelModal {...modalProps} />;
            case 'Anthropic':
                return <AnthropicModelModal {...modalProps} />;
            case 'Google Gemini':
                return <GeminiModelModal {...modalProps} />;
            default:
                return null;
        }
    };

    const expandTypeName = (type) => {
        const typeMap = {
            'Chat Completion': 'Chat Completion',
            'Embedding': 'Text Embedding',
            'Image Generation': 'Image Generation',
            'Speech to Text': 'Speech to Text',
            'Text to Speech': 'Text to Speech',
            'Moderation': 'Content Moderation',
            'Unknown': 'Unknown'
        };
        return typeMap[type] || type;
    };

    return (
        <>
            <Box sx={{ 
                mb: 1,
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexWrap: 'nowrap',
                width: '100%'
            }}>
                <TextField
                    size="small"
                    placeholder={`Search ${provider} models...`}
                    value={filters?.search || ''}
                    onChange={(e) => onFilterChange?.('search', e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: filters?.search && (
                            <IconButton 
                                size="small" 
                                onClick={() => onFilterChange?.('search', '')}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        )
                    }}
                    sx={{ 
                        flex: 1,
                        minWidth: 200
                    }}
                />
                <FormControl size="small" sx={{ width: 200, flexShrink: 0 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={filters?.type || 'all'}
                        label="Type"
                        onChange={(e) => onFilterChange?.('type', e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 300,
                                    '& .MuiMenuItem-root': {
                                        minHeight: '36px',
                                        fontSize: '0.875rem',
                                        padding: '4px 16px',
                                        '&:hover': {
                                            backgroundColor: theme => `${theme.palette.primary.main}08`,
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: theme => `${theme.palette.primary.main}14`,
                                            '&:hover': {
                                                backgroundColor: theme => `${theme.palette.primary.main}20`,
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem value="all" sx={{ fontWeight: 500 }}>All Types</MenuItem>
                        {availableFilters.types.map(type => (
                            <MenuItem key={type} value={type}>
                                {expandTypeName(type)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 150, flexShrink: 0 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters?.status || 'all'}
                        label="Status"
                        onChange={(e) => onFilterChange?.('status', e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 300,
                                    '& .MuiMenuItem-root': {
                                        minHeight: '36px',
                                        fontSize: '0.875rem',
                                        padding: '4px 16px',
                                        '&:hover': {
                                            backgroundColor: theme => `${theme.palette.primary.main}08`,
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: theme => `${theme.palette.primary.main}14`,
                                            '&:hover': {
                                                backgroundColor: theme => `${theme.palette.primary.main}20`,
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem value="all" sx={{ fontWeight: 500 }}>All Status</MenuItem>
                        {availableFilters.statuses.map(status => (
                            <MenuItem key={status} value={status} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: status === 'Active' ? 'success.main' : 'warning.main'
                                    }}
                                />
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 120, flexShrink: 0 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                        value={filters?.year || 'all'}
                        label="Year"
                        onChange={(e) => onFilterChange?.('year', e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 300,
                                    '& .MuiMenuItem-root': {
                                        minHeight: '36px',
                                        fontSize: '0.875rem',
                                        padding: '4px 16px',
                                        '&:hover': {
                                            backgroundColor: theme => `${theme.palette.primary.main}08`,
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: theme => `${theme.palette.primary.main}14`,
                                            '&:hover': {
                                                backgroundColor: theme => `${theme.palette.primary.main}20`,
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem value="all" sx={{ fontWeight: 500 }}>All Years</MenuItem>
                        {availableFilters.years.map(year => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ position: 'relative' }}>
                <IconButton
                    size="small"
                    onClick={() => {
                        onFilterChange?.('search', '');
                        onFilterChange?.('type', 'all');
                        onFilterChange?.('status', 'all');
                        onFilterChange?.('year', 'all');
                    }}
                    sx={{ 
                        position: 'absolute',
                        right: 8,
                        top: -20,
                        height: 40,
                        width: 40,
                        color: 'text.secondary',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            bgcolor: theme => `${theme.palette.primary.main}08`
                        },
                        '&:active': {
                            transform: 'scale(0.96)',
                            transition: 'transform 0.1s'
                        }
                    }}
                    title="Reset filters"
                >
                    <FilterAltOffIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Model ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Created</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Context</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Training Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {safeModels.map((model) => (
                                <TableRow 
                                    key={model.id}
                                    onClick={() => handleModelClick(model)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: theme => `${theme.palette.primary.main}08`,
                                        },
                                        transition: 'background-color 0.2s ease-in-out',
                                    }}
                                >
                                    <TableCell align="center">
                                        <Chip
                                            label={model.status}
                                            size="small"
                                            color={model.status === 'Active' ? 'success' : 'warning'}
                                            sx={{
                                                height: 24,
                                                fontSize: "0.75rem",
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontWeight: 600
                                            }}
                                        >
                                            {expandTypeName(model.type)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{model.id}</TableCell>
                                    <TableCell>
                                        {new Date(model.created * 1000).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {model.context_length ? `${(model.context_length / 1000).toFixed(1)}k` : "-"}
                                    </TableCell>
                                    <TableCell>{model.training_data || "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                px: 1
            }}>
                <Typography variant="caption" color="text.secondary">
                    Last updated: {filters?.lastUpdated ? new Date(filters.lastUpdated).toLocaleString() : 'Never'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {safeModels.length} models
                    </Typography>
                </Box>
            </Box>

            {getModalComponent()}
        </>
    );
} 