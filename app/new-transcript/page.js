"use client";

import React, { useState } from 'react';
import { Typography, Box, Paper, TextField, Grid, Card, Button, IconButton,
    Dialog, DialogContent, DialogTitle, Select, MenuItem, FormControl,
    InputLabel, Switch, FormControlLabel, Divider, Chip, LinearProgress,
    IconButton as MuiIconButton, List, ListItemButton, ListItemIcon, ListItemText,
    Tabs, Tab, FormHelperText, Slider
} from '@mui/material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useTheme } from '@mui/material/styles';
import { TextFields, Description, Mic, Upload, CheckCircle,
    Language, Person, Timer, Settings, PlayArrow, Pause,
    Close as CloseIcon, CreditCard, Tune, FormatAlignLeft, ChevronLeft, ChevronRight,
    Psychology, Output, Group, School, RecordVoiceOver, Slideshow, Build, Refresh
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranscriptConfig } from '../../src/hooks/useTranscriptConfig';
import transcriptData from '../../data/transcriptTypes.json';

const iconMap = {
    Group,
    School,
    RecordVoiceOver,
    Slideshow,
    Build,
    Description
};

const TranscriptTypeSelect = ({ value, onChange }) => {
    const { config } = useTranscriptConfig();
    
    return (
        <FormControl 
            fullWidth 
            sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    '&:hover': {
                        bgcolor: 'background.paper'
                    }
                }
            }}
        >
            <InputLabel>Transcript Type</InputLabel>
            <Select
                value={value}
                label="Transcript Type"
                onChange={onChange}
                sx={{
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1.5
                    }
                }}
            >
                {Object.entries(config.types).map(([type, typeConfig]) => {
                    const Icon = iconMap[typeConfig.icon] || iconMap.Description;
                    return (
                        <MenuItem 
                            key={type} 
                            value={type}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                py: 1
                            }}
                        >
                            <Icon sx={{ color: typeConfig.color, fontSize: 20, mt: 0.5 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.2 }}>
                                    {typeConfig.label}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ 
                                        display: 'block',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {typeConfig.description}
                                </Typography>
                            </Box>
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default function NewTranscriptPage() {
    const theme = useTheme();
    const router = useRouter();
    const { config } = useTranscriptConfig();
    const [activeMethod, setActiveMethod] = useState('');
    const [textContent, setTextContent] = useState('');
    const [uploadedMedia, setUploadedMedia] = useState(null);
    const [uploadedDocument, setUploadedDocument] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const [speakerDetection, setSpeakerDetection] = useState(true);
    const [aiModel, setAiModel] = useState('balanced');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedType, setSelectedType] = useState('meeting');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubType, setSelectedSubType] = useState('');

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedType(''); // Reset type when category changes
        setSelectedSubType(''); // Reset subtype when category changes
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setSelectedSubType(''); // Reset subtype when type changes
    };

    const handleSubTypeChange = (event) => {
        setSelectedSubType(event.target.value);
    };

    const categories = transcriptData[0]?.transcriptCategories || [];
    const types = selectedCategory ? categories.find(cat => cat.name === selectedCategory)?.transcriptTypes || [] : [];
    const subTypes = selectedType ? (types.find(type => type.type === selectedType)?.description.split(', ') || []) : [];

    const sortedCategories = categories.length ? [...categories].sort((a, b) => a.name.localeCompare(b.name)) : [];
    const sortedTypes = types.length ? [...types].sort((a, b) => a.type.localeCompare(b.type)) : [];
    const sortedSubTypes = subTypes.length ? [...subTypes].sort() : [];

    console.log('Categories:', sortedCategories);
    console.log('Types:', sortedTypes);
    console.log('SubTypes:', sortedSubTypes);

    const PreviewContent = () => {
        const activeMethodData = methods.find(m => m.id === activeMethod);
        
        const renderPreview = () => {
            return (
                <Box sx={{ height: '100%' }}>
                    {(() => {
                        switch (activeMethod) {
                            case 'text':
                                return (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Text Content Preview
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                height: 'calc(100% - 40px)',
                                                bgcolor: 'action.hover',
                                                overflow: 'auto'
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {textContent || 'No content available'}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                );
                            case 'upload':
                                return (
                                    <Box sx={{ height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Media File Preview
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                height: 'calc(100% - 40px)',
                                                bgcolor: 'action.hover',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2
                                            }}
                                        >
                                            {uploadedMedia ? (
                                                <>
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2
                                                    }}>
                                                        <IconButton
                                                            onClick={() => setIsPlaying(!isPlaying)}
                                                            sx={{
                                                                bgcolor: `${activeMethodData?.color}14`,
                                                                color: activeMethodData?.color,
                                                                '&:hover': {
                                                                    bgcolor: `${activeMethodData?.color}24`,
                                                                }
                                                            }}
                                                        >
                                                            {isPlaying ? <Pause /> : <PlayArrow />}
                                                        </IconButton>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={600}>
                                                                {uploadedMedia.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {(uploadedMedia.size / (1024 * 1024)).toFixed(2)} MB
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ width: '100%', mt: 2 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={isPlaying ? 45 : 0}
                                                            sx={{
                                                                bgcolor: `${activeMethodData?.color}14`,
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: activeMethodData?.color
                                                                }
                                                            }}
                                                        />
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between',
                                                            mt: 1
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {isPlaying ? '2:15' : '0:00'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                5:30
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No media file selected
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                );
                            case 'document':
                                return (
                                    <Box sx={{ height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Document Preview
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                height: 'calc(100% - 40px)',
                                                bgcolor: 'action.hover',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2
                                            }}
                                        >
                                            {uploadedDocument ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Description 
                                                        sx={{ 
                                                            fontSize: 48,
                                                            color: activeMethodData?.color,
                                                            mb: 2
                                                        }} 
                                                    />
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {uploadedDocument.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(uploadedDocument.size / (1024 * 1024)).toFixed(2)} MB
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No document selected
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                );
                            case 'live':
                                return (
                                    <Box sx={{ height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Live Recording Preview
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                height: 'calc(100% - 40px)',
                                                bgcolor: 'action.hover',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2
                                            }}
                                        >
                                            {isRecording ? (
                                                <>
                                                    <Box sx={{ 
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 3
                                                    }}>
                                                        <Box sx={{ 
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: theme.palette.error.main,
                                                            animation: 'pulse 2s infinite'
                                                        }} />
                                                        <Typography variant="subtitle2" fontWeight={600}>
                                                            Recording in Progress
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            2:15
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ 
                                                        width: '100%',
                                                        height: 60,
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    }}>
                                                        {/* Audio waveform visualization would go here */}
                                                        <Box sx={{ 
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Audio Waveform Visualization
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Click the microphone icon to start recording
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                );
                            default:
                                return (
                                    <Typography variant="body2" color="text.secondary">
                                        Select a method to preview content
                                    </Typography>
                                );
                        }
                    })()}
                </Box>
            );
        };

        return (
            <Box sx={{ height: '100%' }}>
                {renderPreview()}
            </Box>
        );
    };

    const handleMethodChange = (methodId) => {
        // If selecting a different method, reset previous content
        if (activeMethod !== methodId) {
            setTextContent('');
            setUploadedMedia(null);
            setUploadedDocument(null);
            setIsRecording(false);
            setActiveMethod(methodId);
        }
        // Don't deselect when clicking the same method
    };

    const methods = [
        {
            id: 'text',
            title: 'Paste Text',
            description: 'Copy and paste your content',
            icon: <TextFields sx={{ fontSize: 32 }} />,
            color: '#9c27b0'
        },
        {
            id: 'document',
            title: 'Import Text',
            description: 'Import from Word, Text or PDF files',
            icon: <Description sx={{ fontSize: 32 }} />,
            color: theme.palette.success.main
        },
        {
            id: 'live',
            title: 'Live Recording',
            description: 'Record and transcribe in real-time',
            icon: <Mic sx={{ fontSize: 32 }} />,
            color: theme.palette.error.main
        },
        {
            id: 'upload',
            title: 'Upload Media',
            description: 'Upload audio or video files',
            icon: <Upload sx={{ fontSize: 32 }} />,
            color: theme.palette.primary.main
        }
    ];

    const ProcessingModal = () => {
        const activeMethodData = methods.find(m => m.id === activeMethod);
        const [activeStep, setActiveStep] = useState(0);
        const [processingOptions, setProcessingOptions] = useState({
            // Common options
            language: 'en',
            customVocabulary: '',
            outputFormat: 'docx',
            template: 'standard',
            // Text specific
            enhanceFormatting: true,
            detectParagraphs: true,
            detectHeadings: true,
            smartPunctuation: true,
            // Media specific
            speakerDetection: true,
            noiseReduction: true,
            enhanceAudio: true,
            // Recording specific
            realtimeTranscription: true,
            autoLanguageDetection: true,
            // Document specific
            preserveFormatting: true,
            extractImages: true,
            tableDetection: true,
            aiModel: 'gpt-4',
            customPrompt: '',
            maxTokens: 150,
            temperature: 0.7,
            topP: 0.9,
            frequencyPenalty: 0,
            presencePenalty: 0,
            stopSequences: '',
            insightsStream: false,
            tinderSwipers: false,
            recapioBytes: false,
            recapioAnchor: false,
            onePager: false
        });

        // Add color definitions for each output type
        const outputColors = {
            insightsStream: '#1E88E5',    // Strong Blue
            tinderSwipers: '#009688',     // Teal (keeping this one)
            onePager: '#D81B60',          // Raspberry
            recapioSlides: '#5C6BC0',     // Indigo
            recapioBytes: '#7B1FA2',      // Deep Purple
            recapioAnchor: '#F57C00'      // Dark Orange
        };

        const getMethodSpecificSteps = () => {
            const commonSteps = [
                {
                    title: 'Preview',
                    icon: <Description />,
                    component: <PreviewContent />
                },
                {
                    title: 'Outputs',
                    icon: <Output />,
                    component: (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>Select Output Formats</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Choose one or more output formats for your content
                                </Typography>
                            </Grid>
                            <Box sx={{ 
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                px: 2
                            }}>
                                <Box sx={{ 
                                    width: '100%',
                                    maxWidth: 1200,
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: 'center',
                                    margin: '0 auto'
                                }}>
                                    {Object.entries({
                                        insightsStream: {
                                            title: 'Recapio Stream',
                                            description: 'Real-time stream of key insights & summaries',
                                            price: 0.75,
                                            tokens: 1500
                                        },
                                        tinderSwipers: {
                                            title: 'Recapio Cards',
                                            description: 'Card generation & formatting',
                                            price: 0.25,
                                            tokens: 500
                                        },
                                        onePager: {
                                            title: 'Recapio One Pager',
                                            description: 'Summary generation & formatting',
                                            price: 0.50,
                                            tokens: 1000
                                        },
                                        recapioSlides: {
                                            title: 'Recapio Slides',
                                            description: 'Presentation slides & key points',
                                            price: 0.75,
                                            tokens: 1500
                                        },
                                        recapioBytes: {
                                            title: 'Recapio Bytes',
                                            description: 'Audio generation & processing',
                                            price: 1.00,
                                            tokens: 2000
                                        },
                                        recapioAnchor: {
                                            title: 'Recapio Anchor',
                                            description: 'Video generation & rendering',
                                            price: 2.00,
                                            tokens: 4000
                                        }
                                    }).map(([key, value]) => (
                                        <Box key={key} sx={{ width: '16%', minWidth: 180 }}>
                                            <Card sx={{
                                                height: 180,
                                                p: 2,
                                                border: 1,
                                                borderColor: processingOptions[key] ? outputColors[key] : 'divider',
                                                bgcolor: processingOptions[key] ? `${outputColors[key]}08` : 'background.paper',
                                                transition: 'all 0.2s ease-in-out',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                '&:hover': {
                                                    borderColor: outputColors[key],
                                                    bgcolor: `${outputColors[key]}08`,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: processingOptions[key] ? 4 : 2
                                                },
                                                boxShadow: processingOptions[key] ? 3 : 1
                                            }}
                                            onClick={() => setProcessingOptions({
                                                ...processingOptions,
                                                [key]: !processingOptions[key]
                                            })}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight={600} sx={{ 
                                                                color: processingOptions[key] ? outputColors[key] : 'text.primary',
                                                                fontSize: '1rem',
                                                                lineHeight: 1.2
                                                            }}>
                                                                Recapio<br/>{value.title.replace('Recapio ', '')}
                                                            </Typography>
                                                        </Box>
                                                        <Switch
                                                            checked={processingOptions[key]}
                                                            onChange={(e) => e.stopPropagation()}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setProcessingOptions({
                                                                    ...processingOptions,
                                                                    [key]: !processingOptions[key]
                                                                });
                                                            }}
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: outputColors[key],
                                                                    '&:hover': {
                                                                        bgcolor: `${outputColors[key]}14`
                                                                    }
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    bgcolor: `${outputColors[key]}80`
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        fontSize: '0.75rem',
                                                        lineHeight: 1.3,
                                                        height: '2.6em',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        mb: 1
                                                    }}>
                                                        {value.description}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                    <Box />
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="h6" sx={{ 
                                                            color: processingOptions[key] ? outputColors[key] : 'text.secondary',
                                                            fontWeight: 600,
                                                            fontSize: '1.1rem',
                                                            lineHeight: 1,
                                                            mb: 0.5
                                                        }}>
                                                            ${value.price.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            fontSize: '0.7rem',
                                                            lineHeight: 1.4,
                                                            color: processingOptions[key] ? outputColors[key] : 'text.secondary',
                                                            display: 'block'
                                                        }}>
                                                            {value.tokens.toLocaleString()} tokens
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    )
                },
                {
                    title: 'Settings',
                    icon: <Psychology />,
                    component: (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Model</InputLabel>
                                    <Select
                                        value={processingOptions.aiModel || 'gpt-4'}
                                        label="Model"
                                        onChange={(e) => setProcessingOptions({...processingOptions, aiModel: e.target.value})}
                                    >
                                        <MenuItem value="gpt-4">GPT-4 (Most Capable)</MenuItem>
                                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</MenuItem>
                                    </Select>
                                    <FormHelperText>Select the AI model to use for processing</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Custom Prompt"
                                    value={processingOptions.customPrompt || ''}
                                    onChange={(e) => setProcessingOptions({...processingOptions, customPrompt: e.target.value})}
                                    placeholder="Enter custom instructions for the AI model..."
                                    helperText="Customize how the AI processes your content"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Maximum Tokens
                                </Typography>
                                <Slider
                                    value={processingOptions.maxTokens || 150}
                                    onChange={(e, newValue) => setProcessingOptions({...processingOptions, maxTokens: newValue})}
                                    min={1}
                                    max={2048}
                                    step={1}
                                    marks={[
                                        { value: 1, label: '1' },
                                        { value: 2048, label: '2048' }
                                    ]}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Maximum length of the output</FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Temperature
                                </Typography>
                                <Slider
                                    value={processingOptions.temperature || 0.7}
                                    onChange={(e, newValue) => setProcessingOptions({...processingOptions, temperature: newValue})}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 1, label: '1' }
                                    ]}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Controls output randomness (0 = focused, 1 = creative)</FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Top P
                                </Typography>
                                <Slider
                                    value={processingOptions.topP || 0.9}
                                    onChange={(e, newValue) => setProcessingOptions({...processingOptions, topP: newValue})}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 1, label: '1' }
                                    ]}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Controls output diversity</FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Frequency Penalty
                                </Typography>
                                <Slider
                                    value={processingOptions.frequencyPenalty || 0}
                                    onChange={(e, newValue) => setProcessingOptions({...processingOptions, frequencyPenalty: newValue})}
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                    marks={[
                                        { value: -2, label: '-2' },
                                        { value: 2, label: '2' }
                                    ]}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Prevents repetition (-2 to 2)</FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Presence Penalty
                                </Typography>
                                <Slider
                                    value={processingOptions.presencePenalty || 0}
                                    onChange={(e, newValue) => setProcessingOptions({...processingOptions, presencePenalty: newValue})}
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                    marks={[
                                        { value: -2, label: '-2' },
                                        { value: 2, label: '2' }
                                    ]}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Encourages new topics (-2 to 2)</FormHelperText>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Stop Sequences"
                                    value={processingOptions.stopSequences || ''}
                                    onChange={(e) => setProcessingOptions({...processingOptions, stopSequences: e.target.value})}
                                    placeholder="Enter comma-separated sequences"
                                    helperText="Sequences where the AI should stop generating (comma-separated)"
                                />
                            </Grid>
                        </Grid>
                    )
                }
            ];

            // Return different steps based on the active method
            switch (activeMethod) {
                case 'text':
                    return commonSteps;
                case 'upload':
                    return commonSteps;
                case 'document':
                    return commonSteps;
                case 'live':
                    return commonSteps;
                default:
                    return commonSteps;
            }
        };

        const steps = getMethodSpecificSteps();

        return (
            <Dialog 
                open={isProcessingModalOpen} 
                onClose={() => setIsProcessingModalOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { 
                        height: 600,
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    p: 2,
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 48px',
                    alignItems: 'flex-start',
                    gap: 2.5,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${activeMethodData?.color}14`,
                            color: activeMethodData?.color,
                            flexShrink: 0
                        }}
                    >
                        {activeMethodData?.icon && React.cloneElement(activeMethodData.icon, { 
                            sx: { fontSize: 28 } 
                        })}
                    </Box>
                    <Box sx={{ pt: 0.5 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                mb: 0.25,
                                color: theme.palette.text.primary,
                                lineHeight: 1.2
                            }}
                        >
                            {activeMethodData?.title}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: '0.875rem',
                                lineHeight: 1.4
                            }}
                        >
                            {activeMethodData?.description}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                            onClick={() => setIsProcessingModalOpen(false)}
                            sx={{ color: 'text.secondary' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}>
                    <Tabs
                        value={activeStep}
                        onChange={(e, newValue) => setActiveStep(newValue)}
                        variant="fullWidth"
                        sx={{
                            minHeight: 64,
                            '& .MuiTab-root': {
                                minHeight: 64,
                                py: 2,
                                px: 3,
                                textTransform: 'none',
                                fontSize: '0.9375rem',
                                fontWeight: 500,
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: activeMethodData?.color,
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: activeMethodData?.color
                            }
                        }}
                    >
                        {steps.map((step) => (
                            <Tab
                                key={step.title}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {step.icon && React.cloneElement(step.icon, { 
                                            sx: { fontSize: 24 } 
                                        })}
                                        {step.title}
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>

                <DialogContent sx={{ p: 3, height: 'calc(100% - 130px)' }}>
                    <Box sx={{ height: '100%' }}>
                        {steps[activeStep].component}
                    </Box>
                </DialogContent>

                <Box sx={{ 
                    p: 3, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Tokens:
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '1.5rem'
                            }}>
                                {Object.entries({
                                    insightsStream: 1500,
                                    onePager: 1000,
                                    tinderSwipers: 500,
                                    recapioBytes: 2000,
                                    recapioAnchor: 4000,
                                    recapioSlides: 1500
                                }).reduce((total, [key, tokens]) => 
                                    total + (processingOptions[key] ? tokens : 0)
                                , 0).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Estimated Cost:
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '1.5rem'
                            }}>
                                ${Object.entries({
                                    insightsStream: 0.75,
                                    onePager: 0.50,
                                    tinderSwipers: 0.25,
                                    recapioBytes: 1.00,
                                    recapioAnchor: 2.00,
                                    recapioSlides: 0.75
                                }).reduce((total, [key, price]) => 
                                    total + (processingOptions[key] ? price : 0)
                                , 0).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {activeStep === 1 && (
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    const allSelected = Object.keys(outputColors).every(key => processingOptions[key]);
                                    const newState = !allSelected;
                                    setProcessingOptions(prev => ({
                                        ...prev,
                                        ...Object.keys(outputColors).reduce((acc, key) => ({
                                            ...acc,
                                            [key]: newState
                                        }), {})
                                    }));
                                }}
                                startIcon={<CheckCircle />}
                            >
                                {Object.keys(outputColors).every(key => processingOptions[key]) ? 'Deselect All' : 'Select All'}
                            </Button>
                        )}
                        {activeStep > 0 && (
                            <Button
                                variant="outlined"
                                onClick={() => setActiveStep(activeStep - 1)}
                                startIcon={<ChevronLeft />}
                            >
                                Previous
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (activeStep < steps.length - 1) {
                                    setActiveStep(activeStep + 1);
                                } else {
                                    // Start processing
                                }
                            }}
                            endIcon={activeStep < steps.length - 1 ? <ChevronRight /> : null}
                            sx={{ 
                                bgcolor: activeMethodData?.color,
                                '&:hover': {
                                    bgcolor: activeMethodData?.color
                                }
                            }}
                        >
                            {activeStep < steps.length - 1 ? 'Next' : 'Start Processing'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        );
    };

    return (
        <PageLayout
            title="New Transcript"
            subtitle="Choose a method to create your transcript"
        >
            <ContentCard>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', height: 56 }}>
                        <FormControl fullWidth variant="outlined" sx={{ height: '100%' }}>
                            <InputLabel
                                shrink={true}
                                sx={{
                                    fontSize: '1rem',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    '&.Mui-focused': {
                                        color: 'rgba(0, 0, 0, 0.87)'
                                    }
                                }}
                            >
                                Category
                            </InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="Category"
                                notched
                                sx={{ height: '100%' }}
                            >
                                {(sortedCategories || []).map((category) => (
                                    <MenuItem key={category.name} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" disabled={!selectedCategory} sx={{ height: '100%' }}>
                            <InputLabel
                                shrink={true}
                                sx={{
                                    fontSize: '1rem',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    '&.Mui-focused': {
                                        color: 'rgba(0, 0, 0, 0.87)'
                                    }
                                }}
                            >
                                Type
                            </InputLabel>
                            <Select
                                value={selectedType}
                                onChange={handleTypeChange}
                                label="Type"
                                notched
                                sx={{ height: '100%' }}
                            >
                                {(selectedCategory && sortedTypes || []).map((type) => (
                                    <MenuItem key={type.type} value={type.type}>
                                        {type.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" disabled={!selectedCategory || !selectedType} sx={{ height: '100%' }}>
                            <InputLabel
                                shrink={true}
                                sx={{
                                    fontSize: '1rem',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    '&.Mui-focused': {
                                        color: 'rgba(0, 0, 0, 0.87)'
                                    }
                                }}
                            >
                                Sub Type
                            </InputLabel>
                            <Select
                                value={selectedSubType}
                                onChange={handleSubTypeChange}
                                label="Sub Type"
                                notched
                                sx={{ height: '100%' }}
                            >
                                {(selectedType && sortedSubTypes || []).map((subType) => (
                                    <MenuItem key={subType} value={subType}>
                                        {subType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton
                            onClick={() => {
                                setSelectedCategory('');
                                setSelectedType('');
                                setSelectedSubType('');
                            }}
                            sx={{
                                color: 'text.secondary',
                                height: 40, // Set consistent height
                                width: 40
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Box>
                    
                    <Grid 
                        container 
                        spacing={3} 
                        sx={{ 
                            '& > .MuiGrid-item': {
                                height: '360px'
                            }
                        }}
                    >
                        {methods.map((method) => (
                            <Grid item xs={12} sm={6} key={method.id}>
                                <Card
                                    onClick={() => handleMethodChange(method.id)}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        opacity: activeMethod && activeMethod !== method.id ? 0.35 : 1,
                                        filter: activeMethod && activeMethod !== method.id ? 'grayscale(1)' : 'none',
                                        '&:hover': {
                                            boxShadow: activeMethod === method.id || !activeMethod ? theme.shadows[4] : 'none',
                                            bgcolor: activeMethod === method.id || !activeMethod ? `${method.color}08` : 'transparent',
                                        },
                                    }}
                                >
                                    {activeMethod === method.id && (
                                        <>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    color: method.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsProcessingModalOpen(true);
                                                    }}
                                                    sx={{
                                                        bgcolor: method.color,
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        minWidth: 'auto',
                                                        height: 32,
                                                        fontSize: '0.9375rem',
                                                        px: 2,
                                                        py: 0.75,
                                                        fontWeight: 500,
                                                        '&:hover': {
                                                            bgcolor: method.color
                                                        }
                                                    }}
                                                >
                                                    Continue
                                                </Button>
                                                <CheckCircle sx={{ 
                                                    fontSize: 26,
                                                    filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))'
                                                }} />
                                            </Box>
                                        </>
                                    )}
                                    <Box 
                                        sx={{ 
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2.5,
                                            pb: 2.5,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: `${method.color}14`,
                                                color: method.color,
                                                flexShrink: 0
                                            }}
                                        >
                                            {React.cloneElement(method.icon, { 
                                                sx: { 
                                                    fontSize: 28
                                                } 
                                            })}
                                        </Box>
                                        <Box sx={{ pt: 0.5 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontSize: '1.125rem',
                                                    fontWeight: 600,
                                                    mb: 0.25,
                                                    color: theme.palette.text.primary,
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {method.title}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.4
                                                }}
                                            >
                                                {method.description}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {method.id === 'text' && (
                                        <>
                                            <Box 
                                                onClick={() => handleMethodChange(method.id)}
                                                sx={{ 
                                                    mt: 3,
                                                    p: 3,
                                                    border: `2px dashed ${theme.palette.divider}`,
                                                    borderRadius: 1,
                                                    bgcolor: `${method.color}08`,
                                                    display: 'flex',
                                                    flex: 1,
                                                    cursor: 'text'
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    placeholder="Paste your text content here..."
                                                    variant="standard"
                                                    value={textContent}
                                                    onChange={(e) => setTextContent(e.target.value)}
                                                    onFocus={() => handleMethodChange(method.id)}
                                                    onClick={() => handleMethodChange(method.id)}
                                                    InputProps={{
                                                        disableUnderline: true
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            height: '100%',
                                                            alignItems: 'flex-start'
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            height: '100% !important',
                                                            p: 0
                                                        },
                                                        '& .MuiInputBase-input::placeholder': {
                                                            color: 'text.primary',
                                                            opacity: 0.8
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </>
                                    )}

                                    {method.id === 'upload' && (
                                        <>
                                            <Box sx={{ 
                                                mt: 3,
                                                p: 3,
                                                border: `2px dashed ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                bgcolor: `${method.color}08`,
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                flex: 1,
                                                justifyContent: 'center'
                                            }}>
                                                <input
                                                    type="file"
                                                    accept="audio/*,video/*"
                                                    style={{ display: 'none' }}
                                                    id={`media-upload-${method.id}`}
                                                    onChange={(e) => {
                                                        setUploadedMedia(e.target.files[0]);
                                                        handleMethodChange(method.id);
                                                    }}
                                                />
                                                <label 
                                                    htmlFor={`media-upload-${method.id}`} 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!activeMethod || activeMethod === method.id) {
                                                            return;
                                                        }
                                                        handleMethodChange(method.id);
                                                    }}
                                                >
                                                    <Button
                                                        component="span"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<Upload />}
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            opacity: '1 !important',
                                                            filter: 'none !important',
                                                            '&.Mui-disabled': {
                                                                bgcolor: theme.palette.primary.main,
                                                                color: 'white',
                                                                opacity: '1 !important'
                                                            }
                                                        }}
                                                    >
                                                        {uploadedMedia ? uploadedMedia.name : 'Choose Media File'}
                                                    </Button>
                                                </label>
                                                <Typography variant="caption" color="text.secondary">
                                                    Supported: MP3, WAV, MP4, MOV (max 50MB)
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {method.id === 'document' && (
                                        <>
                                            <Box sx={{ 
                                                mt: 3,
                                                p: 3,
                                                border: `2px dashed ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                bgcolor: `${method.color}08`,
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                flex: 1,
                                                justifyContent: 'center'
                                            }}>
                                                <input
                                                    type="file"
                                                    accept=".doc,.docx,.txt,.pdf"
                                                    style={{ display: 'none' }}
                                                    id={`document-upload-${method.id}`}
                                                    onChange={(e) => {
                                                        setUploadedDocument(e.target.files[0]);
                                                        handleMethodChange(method.id);
                                                    }}
                                                />
                                                <label 
                                                    htmlFor={`document-upload-${method.id}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!activeMethod || activeMethod === method.id) {
                                                            return;
                                                        }
                                                        handleMethodChange(method.id);
                                                    }}
                                                >
                                                    <Button
                                                        component="span"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<Description />}
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            opacity: '1 !important',
                                                            filter: 'none !important',
                                                            '&.Mui-disabled': {
                                                                bgcolor: theme.palette.success.main,
                                                                color: 'white',
                                                                opacity: '1 !important'
                                                            }
                                                        }}
                                                    >
                                                        {uploadedDocument ? uploadedDocument.name : 'Choose Document'}
                                                    </Button>
                                                </label>
                                                <Typography variant="caption" color="text.secondary">
                                                    Supported: DOC, DOCX, TXT, PDF
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {method.id === 'live' && (
                                        <>
                                            <Box sx={{ 
                                                mt: 3,
                                                p: 3,
                                                border: `2px dashed ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                bgcolor: `${method.color}08`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2,
                                                flex: 1,
                                                height: '100%'
                                            }}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 2
                                                }}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMethodChange(method.id);
                                                            if (activeMethod === method.id) {
                                                                setIsRecording(!isRecording);
                                                            }
                                                        }}
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            bgcolor: 'background.paper !important',
                                                            opacity: '1 !important',
                                                            filter: 'none !important',
                                                            borderRadius: '50%',
                                                            boxShadow: theme.shadows[2],
                                                            '&:hover': {
                                                                bgcolor: `${method.color}14`,
                                                                boxShadow: theme.shadows[4],
                                                            },
                                                            ...(isRecording && {
                                                                bgcolor: `${method.color}14`,
                                                                animation: 'pulse 2s infinite'
                                                            }),
                                                            '&.Mui-disabled': {
                                                                bgcolor: 'background.paper !important',
                                                                opacity: '1 !important',
                                                                color: 'inherit',
                                                                boxShadow: theme.shadows[2]
                                                            }
                                                        }}
                                                    >
                                                        <Mic sx={{ 
                                                            fontSize: 32, 
                                                            color: isRecording ? theme.palette.error.main : method.color,
                                                            opacity: '1 !important'
                                                        }} />
                                                    </IconButton>
                                                    <Typography variant="body2" color="text.secondary" align="center">
                                                        {isRecording ? 'Recording...' : 'Click to start recording'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </ContentCard>
            <ProcessingModal />
        </PageLayout>
    );
} 