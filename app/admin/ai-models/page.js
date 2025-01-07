'use client';

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { Box, Tabs, Tab, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, FormControl, InputLabel, Select, MenuItem, Typography, Snackbar, Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import ContentCard from '@/components/ContentCard';
import ModelsTable from '@/components/ModelsTable';

export default function AIModelsPage() {
    const [activeTab, setActiveTab] = useState('default');
    const [openaiModels, setOpenaiModels] = useState([]);
    const [anthropicModels, setAnthropicModels] = useState([]);
    const [geminiModels, setGeminiModels] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        status: 'all',
        year: 'all'
    });
    const [defaultModels, setDefaultModels] = useState({
        'Chat Completion': { provider: 'openai', modelId: '' },
        'Text Embedding': { provider: 'openai', modelId: '' },
        'Image Generation': { provider: 'openai', modelId: '' },
        'Speech to Text': { provider: 'openai', modelId: '' },
        'Text to Speech': { provider: 'openai', modelId: '' },
        'Moderation': { provider: 'openai', modelId: '' }
    });
    const [saveStatus, setSaveStatus] = useState({ open: false, message: '', severity: 'success' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAllModels();
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
            } else {
                throw new Error(response.data.error || 'Failed to fetch OpenAI models');
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
            } else {
                throw new Error(response.data.error || 'Failed to fetch Anthropic models');
            }
        } catch (error) {
            console.error('Error fetching Anthropic models:', error);
        }
    };

    const fetchGeminiModels = async () => {
        try {
            console.log('Fetching Gemini models...');
            const response = await axios.get('/api/models/gemini');
            console.log('Gemini API response:', response.data);
            if (response.data.success && response.data.models) {
                console.log('Setting Gemini models:', response.data.models.length);
                setGeminiModels(response.data.models);
                setLastUpdated(prev => ({
                    ...prev,
                    gemini: response.data.lastUpdated
                }));
            } else {
                console.error('Gemini API error:', response.data.error);
                throw new Error(response.data.error || 'Failed to fetch Gemini models');
            }
        } catch (error) {
            console.error('Error fetching Gemini models:', error);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const getAvailableFilters = (models) => {
        const types = new Set(models.map(model => model.type));
        const statuses = new Set(models.map(model => model.status));
        const years = new Set(models.map(model => new Date(model.created * 1000).getFullYear()));
        
        return {
            types: Array.from(types).sort(),
            statuses: Array.from(statuses).sort(),
            years: Array.from(years).sort((a, b) => b - a)
        };
    };

    const sortModels = (models) => {
        return [...models].sort((a, b) => {
            // First sort by type
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            // Then by created date (most recent first)
            return b.created - a.created;
        });
    };

    const filterModels = (models) => {
        return models.filter(model => {
            const matchesSearch = !filters.search || 
                model.id.toLowerCase().includes(filters.search.toLowerCase());
            
            const matchesType = filters.type === 'all' || 
                model.type === filters.type;
            
            const matchesStatus = filters.status === 'all' || 
                model.status.toLowerCase() === filters.status.toLowerCase();
            
            const modelYear = new Date(model.created * 1000).getFullYear();
            const matchesYear = filters.year === 'all' || 
                modelYear === parseInt(filters.year);

            return matchesSearch && matchesType && matchesStatus && matchesYear;
        });
    };

    const currentModels = useMemo(() => {
        let models = [];
        switch (activeTab) {
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
        return sortModels(models);
    }, [activeTab, openaiModels, anthropicModels, geminiModels]);

    const availableFilters = useMemo(() => 
        getAvailableFilters(currentModels),
        [currentModels]
    );

    const handleDefaultModelChange = (type, field, value) => {
        setDefaultModels(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
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
        // Map the UI type to the actual model type
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

    useEffect(() => {
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
        loadSavedDefaults();
    }, []);

    return (
        <ContentCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            minHeight: '42px',
                            py: 0.5
                        }
                    }}
                >
                    <Tab label="Default Models" value="default" />
                    <Tab label="OpenAI Models" value="openai" />
                    <Tab label="Anthropic Models" value="anthropic" />
                    <Tab label="Google Gemini Models" value="gemini" />
                </Tabs>
            </Box>

            {activeTab !== 'default' ? (
                <>
                    <ModelsTable
                        models={filterModels(currentModels)}
                        filters={{ ...filters, lastUpdated: lastUpdated[activeTab] }}
                        onFilterChange={handleFilterChange}
                        provider={activeTab === 'openai' ? 'OpenAI' : activeTab === 'anthropic' ? 'Anthropic' : 'Google Gemini'}
                        availableFilters={availableFilters}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={refreshing[activeTab] ? <CircularProgress size={20} /> : <RefreshIcon />}
                            onClick={() => refreshModels(activeTab)}
                            disabled={refreshing[activeTab]}
                        >
                            Refresh {activeTab === 'openai' ? 'OpenAI' : activeTab === 'anthropic' ? 'Anthropic' : 'Google Gemini'} Models
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        mb: 3
                    }}>
                        {/* First Row */}
                        {['Chat Completion', 'Image Generation', 'Text Embedding'].map(type => {
                            const settings = defaultModels[type] || { provider: 'openai', modelId: '' };
                            const availableProviders = getAvailableProvidersForType(type);
                            const availableModels = getModelsForProvider(settings.provider || 'openai', type);
                            
                            if (!availableProviders.includes(settings.provider)) {
                                handleDefaultModelChange(type, 'provider', availableProviders[0] || 'openai');
                                handleDefaultModelChange(type, 'modelId', '');
                            }

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
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {type}
                                        </Typography>
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

                        {/* Second Row */}
                        {['Text to Speech', 'Speech to Text', 'Moderation'].map(type => {
                            const settings = defaultModels[type] || { provider: 'openai', modelId: '' };
                            const availableProviders = getAvailableProvidersForType(type);
                            const availableModels = getModelsForProvider(settings.provider || 'openai', type);
                            
                            if (!availableProviders.includes(settings.provider)) {
                                handleDefaultModelChange(type, 'provider', availableProviders[0] || 'openai');
                                handleDefaultModelChange(type, 'modelId', '');
                            }

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
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {type}
                                        </Typography>
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
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        pt: 2
                    }}>
                        <Button
                            variant="contained"
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
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
                </>
            )}
            <Snackbar
                open={saveStatus.open}
                autoHideDuration={800}
                onClose={() => setSaveStatus(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
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
    );
} 