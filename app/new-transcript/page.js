"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, Paper, TextField, Grid, Card, Button, IconButton,
    Dialog, DialogContent, DialogTitle, Select, MenuItem, FormControl,
    InputLabel, Switch, FormControlLabel, Divider, Chip, LinearProgress,
    IconButton as MuiIconButton, List, ListItemButton, ListItemIcon, ListItemText,
    Tabs, Tab, FormHelperText, Slider, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Snackbar, Alert
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
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log('Supabase Config:', { 
    url: supabaseUrl, 
    key: supabaseKey?.substring(0, 10) + '...' 
});
const supabase = createClient(supabaseUrl, supabaseKey);

// Add test query
(async () => {
    const { data, error } = await supabase
        .from('transcript_types')
        .select('*');
    console.log('Initial test query:', { data, error });
})();

const fetchTranscriptData = async () => {
  const { data, error } = await supabase
    .from('transcript_types')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  return data;
};

const insertTranscriptData = async (data) => {
  try {
    // First, let's clear existing data to avoid duplicates
    const { error: deleteError } = await supabase
      .from('transcript_types')
      .delete()
      .neq('id', 0); // This will delete all records

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError);
      return;
    }

    // Now insert the new data
    for (const category of data[0].transcriptCategories) {
      for (const type of category.transcriptTypes) {
        const { error } = await supabase
          .from('transcript_types')
          .insert({
            category: category.name,
            type: type.type,
            subType: type.description,
            color: category.color,
            icon: category.icon
          });

        if (error) {
          console.error('Error inserting data:', error);
        }
      }
    }
  } catch (err) {
    console.error('Error in database operation:', err);
  }
};

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
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [language, setLanguage] = useState('en');
    const [speakerDetection, setSpeakerDetection] = useState(true);
    const [aiModel, setAiModel] = useState('balanced');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubType, setSelectedSubType] = useState('');
    const [errors, setErrors] = useState({ 
        category: false, 
        type: false, 
        subType: false,
        title: false 
    });
    const [transcriptData, setTranscriptData] = useState([]);
    const [requestedOutputs, setRequestedOutputs] = useState([]);
    const [title, setTitle] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState({ 
        text: 'Transcript saved successfully!', 
        severity: 'success' 
    });

    // Derived state
    const processedCategories = useMemo(() => {
        const categories = [...new Set(transcriptData.map(item => item.category))];
        return categories.sort();
    }, [transcriptData]);

    const availableTypes = useMemo(() => {
        if (!selectedCategory) return [];
        return [...new Set(transcriptData
            .filter(item => item.category === selectedCategory)
            .map(item => item.type))]
            .sort();
    }, [selectedCategory, transcriptData]);

    const availableSubTypes = useMemo(() => {
        if (!selectedType || !selectedCategory) return [];
        return [...new Set(transcriptData
            .filter(item => 
                item.category === selectedCategory && 
                item.type === selectedType
            )
            .map(item => item.sub_type))]
            .sort();
    }, [selectedType, selectedCategory, transcriptData]);

    useEffect(() => {
        const fetchTranscriptTypes = async () => {
            try {
                console.log('Fetching transcript types...');
                const { data, error } = await supabase
                    .from('transcript_types')
                    .select('*')
                    .order('category')
                    .order('type')
                    .order('sub_type');

                if (error) {
                    console.error('Error fetching transcript types:', error);
                    return;
                }

                console.log('Fetched data:', data);
                setTranscriptData(data || []);
            } catch (error) {
                console.error('Error in fetchTranscriptTypes:', error);
            }
        };

        fetchTranscriptTypes();
    }, []);

    useEffect(() => {
        if (selectedType) {
            // Find the matching sub-types for the selected type
            const typeData = transcriptData.find(
                item => item.category === selectedCategory && item.type === selectedType
            );
            if (typeData) {
                setSelectedSubType(''); // Reset sub-type when type changes
            }
        } else {
            setSelectedSubType('');
        }
    }, [selectedType, selectedCategory, transcriptData]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedType('');
        setSelectedSubType('');
        setErrors({ ...errors, category: false });
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setSelectedSubType('');
        setErrors({ ...errors, type: false });
    };

    const handleSubTypeChange = (event) => {
        setSelectedSubType(event.target.value);
        setErrors({ ...errors, subType: false });
    };

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
            // Output types
            insightsStream: false,
            tinderSwipers: false,
            recapioBytes: false,
            recapioAnchor: false,
            onePager: false,
            recapioSlides: false
        });

        // Add color definitions for each output type
        const outputColors = {
            insightsStream: '#1E88E5',    // Strong Blue
            tinderSwipers: '#009688',     // Teal
            onePager: '#D81B60',          // Raspberry
            recapioSlides: '#5C6BC0',     // Indigo
            recapioBytes: '#7B1FA2',      // Deep Purple
            recapioAnchor: '#F57C00'      // Dark Orange
        };

        // Add display names for each output type
        const outputDisplayNames = {
            insightsStream: 'Insights Stream',
            tinderSwipers: 'Tinder Swipers',
            onePager: 'One Pager',
            recapioSlides: 'Recapio Slides',
            recapioBytes: 'Recapio Bytes',
            recapioAnchor: 'Recapio Anchor'
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
                }
            ];

            return commonSteps;
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
                                    'insights_stream': 1500,
                                    'one_pager': 1000,
                                    'tinder_swipers': 500,
                                    'recapio_bytes': 2000,
                                    'recapio_anchor': 4000,
                                    'recapio_slides': 1500
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
                                    'insights_stream': 0.75,
                                    'one_pager': 0.50,
                                    'tinder_swipers': 0.25,
                                    'recapio_bytes': 1.00,
                                    'recapio_anchor': 2.00,
                                    'recapio_slides': 0.75
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
                            onClick={async () => {
                                if (activeStep < steps.length - 1) {
                                    setActiveStep(activeStep + 1);
                                } else {
                                    // Check if any outputs are selected
                                    const hasSelectedOutputs = Object.values(processingOptions).some(value => value === true);
                                    if (!hasSelectedOutputs) {
                                        // TODO: Show error message to user
                                        console.error('Please select at least one output type');
                                        return;
                                    }
                                    await handleSaveTranscript(processingOptions);
                                }
                            }}
                            endIcon={activeStep === steps.length - 1 ? <Psychology /> : <ChevronRight />}
                            sx={{
                                bgcolor: activeMethodData?.color,
                                '&:hover': {
                                    bgcolor: `${activeMethodData?.color}E0`
                                }
                            }}
                        >
                            {activeStep === steps.length - 1 ? 'Start Processing' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        );
    };

    const handleSaveTranscript = async (processingOptions) => {
        console.log('Starting save transcript process...');
        console.log('Processing options:', processingOptions);
        
        // Validate required fields
        const newErrors = {
            category: !selectedCategory,
            type: !selectedType,
            subType: !selectedSubType,
            title: !title.trim()
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            console.log('Validation failed:', newErrors);
            return;
        }

        try {
            console.log('Creating transcript record...');
            // 1. Insert transcript record
            const { data: transcript, error: transcriptError } = await supabase
                .from('transcripts')
                .insert({
                    title: title.trim(),
                    category: selectedCategory,
                    type: selectedType,
                    sub_type: selectedSubType,
                    source_type: 'text',
                    language,
                    status: 'draft',
                    tenant_id: '00000000-0000-0000-0000-000000000000', // Default tenant ID
                    user_id: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (transcriptError) {
                console.error('Error creating transcript:', transcriptError);
                throw transcriptError;
            }

            console.log('Transcript created:', transcript);

            console.log('Saving transcript content...');
            // 2. Insert transcript content
            const { error: contentError } = await supabase
                .from('transcript_contents')
                .insert({
                    transcript_id: transcript.id,
                    original_content: textContent,
                    word_count: textContent.split(/\s+/).length,
                    token_count: Math.ceil(textContent.length / 4) // Rough estimate
                });

            if (contentError) {
                console.error('Error saving content:', contentError);
                throw contentError;
            }

            console.log('Content saved successfully');

            // 3. Insert output requests
            const outputRequests = Object.entries({
                'insights_stream': { tokens: 1500, cost: 0.75 },
                'one_pager': { tokens: 1000, cost: 0.50 },
                'tinder_swipers': { tokens: 500, cost: 0.25 },
                'recapio_bytes': { tokens: 2000, cost: 1.00 },
                'recapio_anchor': { tokens: 4000, cost: 2.00 },
                'recapio_slides': { tokens: 1500, cost: 0.75 }
            })
            .filter(([key]) => {
                // Convert snake_case database keys to camelCase for checking processingOptions
                const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
                return processingOptions[camelKey];
            })
            .map(([key, { tokens, cost }]) => ({
                transcript_id: transcript.id,
                output_type: key,
                estimated_input_tokens: Math.ceil(textContent.length / 4),
                estimated_output_tokens: tokens,
                estimated_cost: cost,
                model_id: processingOptions.aiModel || 'gpt-4',
                status: 'pending'
            }));

            console.log('Saving output requests:', outputRequests);

            if (outputRequests.length > 0) {
                const { error: requestsError } = await supabase
                    .from('transcript_output_requests')
                    .insert(outputRequests);

                if (requestsError) {
                    console.error('Error saving output requests:', requestsError);
                    throw requestsError;
                }
            }

            console.log('Save process completed successfully');
            // Success - show notification, close modal, and redirect
            setShowSuccessNotification(true);
            setIsProcessingModalOpen(false);
            
            // Wait longer before redirecting to ensure notification is seen
            setTimeout(() => {
                router.push('/');
            }, 3000); // Increased to 3 seconds

        } catch (error) {
            console.error('Error saving transcript:', error);
            // Show error notification
            setSnackbarMessage({ 
                text: 'Error saving transcript. Please try again.', 
                severity: 'error' 
            });
            setShowSuccessNotification(true);
        }
    };

    // Add title field to the UI
    const renderTitleField = () => (
        <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: false });
            }}
            error={errors.title}
            helperText={errors.title ? 'Title is required' : ''}
            sx={{ mb: 2 }}
        />
    );

    // Add language selection to the UI
    const renderLanguageSelect = () => (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="nl">Dutch</MenuItem>
                <MenuItem value="pl">Polish</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
            </Select>
        </FormControl>
    );

    return (
        <PageLayout
            title="New Transcript"
            subtitle="Choose a method to create your transcript"
        >
            <ContentCard>
                <Box sx={{ p: 3 }}>
                    {renderTitleField()}
                    {renderLanguageSelect()}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', height: 56 }}>
                        <FormControl fullWidth variant="outlined" error={errors.category} sx={{ height: '100%' }}>
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
                                {processedCategories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.category && <FormHelperText>Please select a category</FormHelperText>}
                        </FormControl>

                        <FormControl 
                            fullWidth 
                            variant="outlined" 
                            disabled={!selectedCategory}
                            error={errors.type}
                            sx={{ height: '100%' }}
                        >
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
                                {availableTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.type && <FormHelperText>Please select a type</FormHelperText>}
                        </FormControl>

                        <FormControl 
                            fullWidth 
                            variant="outlined" 
                            disabled={!selectedType}
                            error={errors.subType}
                            sx={{ height: '100%' }}
                        >
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
                                {availableSubTypes.map((subType) => (
                                    <MenuItem key={subType} value={subType}>
                                        {subType}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.subType && <FormHelperText>Please select a sub type</FormHelperText>}
                        </FormControl>

                        <IconButton
                            onClick={() => {
                                setSelectedCategory('');
                                setSelectedType('');
                                setSelectedSubType('');
                                setErrors({ category: false, type: false, subType: false });
                            }}
                            sx={{
                                color: 'text.secondary',
                                height: 40,
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
                                    onClick={() => {
                                        handleMethodChange(method.id);
                                        if (method.id === 'text') {
                                            setIsProcessingModalOpen(true);
                                        }
                                    }}
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
            <Snackbar
                open={showSuccessNotification}
                autoHideDuration={3000}
                onClose={() => setShowSuccessNotification(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccessNotification(false)} 
                    severity={snackbarMessage.severity}
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        boxShadow: theme.shadows[3],
                        '& .MuiAlert-icon': {
                            fontSize: '24px'
                        },
                        '& .MuiAlert-message': {
                            fontSize: '1rem',
                            fontWeight: 500
                        }
                    }}
                >
                    {snackbarMessage.text}
                </Alert>
            </Snackbar>
        </PageLayout>
    );
} 