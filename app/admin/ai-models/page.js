'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Button, Tabs, Tab, CircularProgress, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Tooltip, IconButton, keyframes } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Refresh as RefreshIcon, Save as SaveIcon, Check as CheckIcon, Warning as WarningIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import ContentCard from '@/components/ContentCard';
import TableControls from '@/components/TableControls';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export default function AIModelsPage() {
    const [activeTab, setActiveTab] = useState('default');
    const [filters, setFilters] = useState({
        search: '',
        columns: [],
        density: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [defaultModels, setDefaultModels] = useState({
        'Chat Completion': { provider: 'openai', modelId: '' },
        'Text Embedding': { provider: 'openai', modelId: '' },
        'Image Generation': { provider: 'openai', modelId: '' },
        'Speech to Text': { provider: 'openai', modelId: '' },
        'Text to Speech': { provider: 'openai', modelId: '' },
        'Moderation': { provider: 'openai', modelId: '' }
    });
    const [isSaving, setIsSaving] = useState(false);
    const [openaiModels, setOpenaiModels] = useState([]);
    const [anthropicModels, setAnthropicModels] = useState([]);
    const [geminiModels, setGeminiModels] = useState([]);
    const [refreshing, setRefreshing] = useState({
        openai: false,
        anthropic: false,
        gemini: false
    });
    const [lastUpdated, setLastUpdated] = useState({
        openai: null,
        anthropic: null,
        gemini: null
    });
    const [saveStatus, setSaveStatus] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchAllModels();
        loadSavedDefaults();
    }, []);

    const fetchAllModels = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchOpenAIModels(),
                fetchAnthropicModels(),
                fetchGeminiModels()
            ]);
        } catch (error) {
            console.error('Error fetching models:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedDefaults = async () => {
        try {
            const response = await axios.get('/api/models/defaults');
            if (response.data.success && response.data.defaults) {
                setDefaultModels(response.data.defaults);
            }
        } catch (error) {
            console.error('Error loading default models:', error);
        }
    };

    const refreshModels = async (provider) => {
        setRefreshing(prev => ({ ...prev, [provider]: true }));
        try {
            const response = await axios.post(`/api/refresh-models/${provider}`);
            if (response.data.success) {
                switch (provider) {
                    case 'openai':
                        await fetchOpenAIModels();
                        break;
                    case 'anthropic':
                        await fetchAnthropicModels();
                        break;
                    case 'gemini':
                        await fetchGeminiModels();
                        break;
                }
            }
        } catch (error) {
            console.error(`Error refreshing ${provider} models:`, error);
        } finally {
            setRefreshing(prev => ({ ...prev, [provider]: false }));
        }
    };

    const fetchOpenAIModels = async () => {
        try {
            const response = await axios.get('/api/models/openai');
            if (response.data.success && response.data.models) {
                setOpenaiModels(response.data.models);
                setLastUpdated(prev => ({
                    ...prev,
                    openai: response.data.lastUpdated
                }));
            }
        } catch (error) {
            console.error('Error fetching OpenAI models:', error);
        }
    };

    const fetchAnthropicModels = async () => {
        try {
            const response = await axios.get('/api/models/anthropic');
            if (response.data.success && response.data.models) {
                setAnthropicModels(response.data.models);
                setLastUpdated(prev => ({
                    ...prev,
                    anthropic: response.data.lastUpdated
                }));
            }
        } catch (error) {
            console.error('Error fetching Anthropic models:', error);
        }
    };

    const fetchGeminiModels = async () => {
        try {
            const response = await axios.get('/api/models/gemini');
            if (response.data.success && response.data.models) {
                setGeminiModels(response.data.models);
                setLastUpdated(prev => ({
                    ...prev,
                    gemini: response.data.lastUpdated
                }));
            }
        } catch (error) {
            console.error('Error fetching Gemini models:', error);
        }
    };

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleRefresh = () => {
        refreshModels(activeTab);
    };

    const handleDefaultModelChange = (type, field, value) => {
        setDefaultModels(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const saveDefaultModels = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post('/api/models/defaults', {
                defaults: defaultModels
            });
            if (response.data.success) {
                setSaveStatus({
                    open: true,
                    message: 'Default models saved successfully',
                    severity: 'success'
                });
            } else {
                throw new Error(response.data.error || 'Failed to save defaults');
            }
        } catch (error) {
            console.error('Error saving default models:', error);
            setSaveStatus({
                open: true,
                message: error.message || 'Failed to save default models',
                severity: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getAvailableProvidersForType = (type) => {
        const providerCapabilities = {
            'Chat Completion': ['openai', 'anthropic', 'gemini'],
            'Text Embedding': ['openai', 'anthropic', 'gemini'],
            'Image Generation': ['openai'],
            'Speech to Text': ['openai'],
            'Text to Speech': ['openai'],
            'Moderation': ['openai']
        };
        return providerCapabilities[type] || [];
    };

    const getModelsForProvider = (provider, type) => {
        let models = [];
        switch (provider) {
            case 'openai':
                models = openaiModels;
                break;
            case 'anthropic':
                models = anthropicModels;
                break;
            case 'gemini':
                models = geminiModels;
                break;
        }
        
        const typeMapping = {
            'Chat Completion': 'Chat Completion',
            'Text Embedding': 'Embedding',
            'Image Generation': 'Image Generation',
            'Speech to Text': 'Speech to Text',
            'Text to Speech': 'Text to Speech',
            'Moderation': 'Moderation'
        };
        
        const modelType = typeMapping[type] || type;
        return models.filter(model => model.type === modelType);
    };

    const getProviderDisplayName = (provider) => {
        switch (provider) {
            case 'openai':
                return 'OpenAI';
            case 'anthropic':
                return 'Anthropic';
            case 'gemini':
                return 'Google Gemini';
            default:
                return provider;
        }
    };

    const getCurrentModels = () => {
        switch (activeTab) {
            case 'openai':
                return openaiModels;
            case 'anthropic':
                return anthropicModels;
            case 'gemini':
                return geminiModels;
            default:
                return [];
        }
    };

    const filterModels = (models) => {
        return models.filter(model => {
            const matchesSearch = !filters.search || 
                model.id.toLowerCase().includes(filters.search.toLowerCase());
            return matchesSearch;
        });
    };

    const getProviderSpecificColumns = (provider) => {
        const commonColumns = [
            { 
                field: 'status', 
                headerName: 'Status', 
                width: 130,
                renderCell: (params) => {
                    const isActive = params.value === 'active';
                    return (
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            px: 1.5,
                            py: 0.5,
                            height: 28,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            bgcolor: isActive ? '#00E676' : '#FFA726',
                            color: isActive ? '#00695C' : '#fff',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            '& .MuiSvgIcon-root': {
                                fontSize: '1rem'
                            }
                        }}>
                            {isActive ? (
                                <Box component="span" sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    bgcolor: '#00695C',
                                    boxShadow: '0 0 0 2px rgba(0,105,92,0.4)',
                                    animation: `${pulseAnimation} 1.5s infinite`
                                }} />
                            ) : (
                                <Box component="span" sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '1px', 
                                    bgcolor: '#fff',
                                    transform: 'rotate(45deg)'
                                }} />
                            )}
                            {params.value}
                        </Box>
                    );
                }
            },
            { 
                field: 'type', 
                headerName: 'Type', 
                width: 180,
                renderCell: (params) => (
                    <Box sx={{ 
                        color: 'text.secondary', 
                        fontSize: '0.875rem',
                        height: 28,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {params.value}
                    </Box>
                )
            },
            { 
                field: 'name', 
                headerName: 'Model Name', 
                flex: 1,
                minWidth: 250,
                renderCell: (params) => (
                    <Box sx={{ 
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                        height: 28,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {params.value}
                    </Box>
                )
            }
        ];

        const actionsColumn = {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5,
                    height: 28,
                    alignItems: 'center',
                    '& .MuiIconButton-root': {
                        p: 0.5,
                        '&:hover': {
                            bgcolor: 'action.hover'
                        }
                    }
                }}>
                    <Tooltip title="Edit Model">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit model:', params.row);
                            }}
                            sx={{ color: 'primary.main' }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Model">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Delete model:', params.row);
                            }}
                            sx={{ color: 'error.main' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        };

        switch (provider) {
            case 'openai':
                return [
                    ...commonColumns,
                    { 
                        field: 'tokens', 
                        headerName: 'Max Tokens', 
                        width: 120,
                        renderCell: (params) => (
                            <Box sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                height: 28,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {params.value}
                            </Box>
                        )
                    },
                    { 
                        field: 'cost', 
                        headerName: 'Cost/1K', 
                        width: 100,
                        renderCell: (params) => (
                            <Box sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                height: 28,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {params.value}
                            </Box>
                        )
                    },
                    actionsColumn
                ];
            case 'anthropic':
                return [
                    ...commonColumns,
                    { 
                        field: 'context', 
                        headerName: 'Context Length', 
                        width: 120,
                        renderCell: (params) => (
                            <Box sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                height: 28,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {params.value}
                            </Box>
                        )
                    },
                    { 
                        field: 'cost', 
                        headerName: 'Cost/1K', 
                        width: 100,
                        renderCell: (params) => (
                            <Box sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                height: 28,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {params.value}
                            </Box>
                        )
                    },
                    actionsColumn
                ];
            default:
                return [
                    ...commonColumns,
                    { 
                        field: 'cost', 
                        headerName: 'Cost/1K', 
                        width: 100,
                        renderCell: (params) => (
                            <Box sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                height: 28,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {params.value}
                            </Box>
                        )
                    },
                    actionsColumn
                ];
        }
    };

    const formatModelData = (model, provider) => {
        const baseData = {
            name: model.display_name || model.id,
            type: model.type || 'Unknown',
            status: model.deprecated ? 'deprecated' : (model.status || 'active'),
            cost: model.cost_per_1k ? `$${model.cost_per_1k.toFixed(4)}` : 'N/A'
        };

        switch (provider) {
            case 'openai':
                return {
                    ...baseData,
                    tokens: model.max_tokens ? model.max_tokens.toLocaleString() : 'N/A'
                };
            case 'anthropic':
                return {
                    ...baseData,
                    context: model.context_length ? `${(model.context_length/1000).toLocaleString()}k` : 'N/A'
                };
            case 'gemini':
                return baseData;
            default:
                return baseData;
        }
    };

    return (
        <Box sx={{ pb: 4 }}>
            <ContentCard sx={{ p: 0 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)}
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        px: 2,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            minHeight: 48,
                            py: 1.5
                        }
                    }}
                >
                    <Tab label="Default Models" value="default" />
                    <Tab label="OpenAI Models" value="openai" />
                    <Tab label="Anthropic Models" value="anthropic" />
                    <Tab label="Google Gemini Models" value="gemini" />
                </Tabs>

                {activeTab === 'default' ? (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 2,
                            mb: 3
                        }}>
                            {Object.entries(defaultModels).map(([type, settings]) => {
                                const availableProviders = getAvailableProvidersForType(type);
                                const availableModels = getModelsForProvider(settings.provider || 'openai', type);
                                
                                return (
                                    <Paper
                                        key={type}
                                        elevation={0}
                                        sx={{ 
                                            p: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}20`
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            pb: 1.5
                                        }}>
                                            <Box sx={{ 
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}>
                                                {type}
                                            </Box>
                                        </Box>

                                        <FormControl 
                                            fullWidth
                                            size="small"
                                        >
                                            <InputLabel>Provider</InputLabel>
                                            <Select
                                                value={settings.provider || 'openai'}
                                                onChange={(e) => {
                                                    handleDefaultModelChange(type, 'provider', e.target.value);
                                                    handleDefaultModelChange(type, 'modelId', '');
                                                }}
                                                label="Provider"
                                                disabled={availableProviders.length === 0}
                                                sx={{
                                                    '& .MuiSelect-select': {
                                                        py: 1.5,
                                                        fontSize: '0.9rem'
                                                    }
                                                }}
                                            >
                                                {availableProviders.map(provider => (
                                                    <MenuItem key={provider} value={provider}>
                                                        {getProviderDisplayName(provider)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl 
                                            fullWidth
                                            size="small"
                                        >
                                            <InputLabel>Model</InputLabel>
                                            <Select
                                                value={settings.modelId || ''}
                                                onChange={(e) => handleDefaultModelChange(type, 'modelId', e.target.value)}
                                                label="Model"
                                                disabled={!settings.provider || availableModels.length === 0}
                                                sx={{
                                                    '& .MuiSelect-select': {
                                                        py: 1.5,
                                                        fontSize: '0.9rem'
                                                    }
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select a model</em>
                                                </MenuItem>
                                                {availableModels.map(model => (
                                                    <MenuItem key={model.id} value={model.id}>
                                                        {model.display_name || model.id}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Paper>
                                );
                            })}
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            gap: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            pt: 2,
                            mt: 3
                        }}>
                            <Button
                                variant="contained"
                                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                                onClick={saveDefaultModels}
                                disabled={isSaving}
                                sx={{ 
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Save Default Models'}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <TableControls
                            onSearch={handleSearch}
                            searchPlaceholder={`Search ${getProviderDisplayName(activeTab)} models...`}
                            sx={{
                                p: 1.5,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                                '& .MuiInputBase-root': {
                                    height: 40
                                }
                            }}
                        />

                        <Box sx={{ 
                            height: 'calc(100vh - 300px)',
                            width: '100%',
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                                    borderBottom: '2px solid',
                                    borderColor: 'divider'
                                },
                                '& .MuiDataGrid-row': {
                                    '&:hover': {
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
                                    }
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
                                }
                            }
                        }}>
                            <DataGrid
                                rows={filterModels(getCurrentModels()).map((model, index) => ({
                                    id: model.id,
                                    ...formatModelData(model, activeTab)
                                }))}
                                columns={getProviderSpecificColumns(activeTab)}
                                pageSize={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                disableSelectionOnClick
                                loading={loading}
                                components={{
                                    NoRowsOverlay: () => (
                                        <Box sx={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            gap: 1
                                        }}>
                                            <Box sx={{ fontSize: '0.95rem', fontWeight: 500, color: 'text.secondary' }}>
                                                No models available
                                            </Box>
                                            <Box sx={{ fontSize: '0.875rem', color: 'text.disabled' }}>
                                                {loading ? 'Loading models...' : `No ${getProviderDisplayName(activeTab)} models found`}
                                            </Box>
                                        </Box>
                                    )
                                }}
                                sx={{
                                    '& .MuiDataGrid-columnHeader': {
                                        py: 2,
                                        '& .MuiDataGrid-columnHeaderTitle': {
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: 'text.primary'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            pt: 2,
                            mt: 3,
                            px: 3,
                            pb: 3,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
                        }}>
                            {lastUpdated[activeTab] && (
                                <Box sx={{ 
                                    fontSize: '0.875rem',
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <Box component="span" sx={{ color: 'text.disabled' }}>Last updated:</Box>
                                    {new Date(lastUpdated[activeTab]).toLocaleString()}
                                </Box>
                            )}
                            <Button
                                variant="contained"
                                startIcon={refreshing[activeTab] ? <CircularProgress size={20} /> : <RefreshIcon />}
                                onClick={handleRefresh}
                                disabled={refreshing[activeTab]}
                                sx={{ 
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {refreshing[activeTab] ? 'Refreshing...' : `Refresh ${getProviderDisplayName(activeTab)} Models`}
                            </Button>
                        </Box>
                    </>
                )}

                <Snackbar
                    open={saveStatus.open}
                    autoHideDuration={800}
                    onClose={() => setSaveStatus(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setSaveStatus(prev => ({ ...prev, open: false }))} 
                        severity={saveStatus.severity}
                        variant="filled"
                        sx={{ 
                            minWidth: '300px',
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 8px'
                        }}
                    >
                        {saveStatus.message}
                    </Alert>
                </Snackbar>
            </ContentCard>
        </Box>
    );
} 