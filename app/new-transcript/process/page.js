"use client";

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Chip,
    LinearProgress
} from '@mui/material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useTheme } from '@mui/material/styles';
import { 
    Language, 
    Person, 
    Timer, 
    Settings, 
    PlayArrow,
    Pause,
    TextFields,
    Description,
    Mic,
    Upload
} from '@mui/icons-material';

export default function ProcessTranscriptPage() {
    const theme = useTheme();
    const [language, setLanguage] = useState('en');
    const [speakerDetection, setSpeakerDetection] = useState(true);
    const [aiModel, setAiModel] = useState('balanced');
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock data - replace with actual data from previous step
    const inputMethod = {
        type: 'upload',
        icon: <Upload sx={{ fontSize: 24 }} />,
        name: 'interview-audio.mp3',
        color: theme.palette.primary.main
    };

    return (
        <PageLayout
            title="Process Transcript"
            subtitle="Configure processing options and preview your content"
        >
            <ContentCard>
                <Box sx={{ p: 3 }}>
                    {/* Input Method Indicator */}
                    <Box sx={{ mb: 4 }}>
                        <Chip
                            icon={inputMethod.icon}
                            label={inputMethod.name}
                            sx={{
                                bgcolor: `${inputMethod.color}14`,
                                color: inputMethod.color,
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    color: inputMethod.color
                                }
                            }}
                        />
                    </Box>

                    <Grid container spacing={4}>
                        {/* Left Column - Preview */}
                        <Grid item xs={12} md={7}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    border: 1, 
                                    borderColor: 'divider',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    borderBottom: 1, 
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Content Preview
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Audio Waveform Placeholder */}
                                    <Box sx={{ 
                                        flex: 1,
                                        bgcolor: 'action.hover',
                                        borderRadius: 1,
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Typography color="text.secondary">
                                            Audio Waveform Visualization
                                        </Typography>
                                    </Box>

                                    {/* Audio Controls */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 2 
                                    }}>
                                        <Button
                                            variant="contained"
                                            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            sx={{ minWidth: 120 }}
                                        >
                                            {isPlaying ? 'Pause' : 'Play'}
                                        </Button>
                                        <Box sx={{ flex: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={30}
                                                sx={{ 
                                                    height: 8,
                                                    borderRadius: 1,
                                                    bgcolor: theme.palette.action.hover,
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: theme.palette.primary.main
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            2:30 / 8:45
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Right Column - Configuration */}
                        <Grid item xs={12} md={5}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    border: 1, 
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    borderBottom: 1, 
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Settings sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Processing Options
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        {/* Language Selection */}
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Language</InputLabel>
                                                <Select
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                    label="Language"
                                                    startAdornment={
                                                        <Language sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }
                                                >
                                                    <MenuItem value="en">English</MenuItem>
                                                    <MenuItem value="es">Spanish</MenuItem>
                                                    <MenuItem value="fr">French</MenuItem>
                                                    <MenuItem value="de">German</MenuItem>
                                                    <MenuItem value="auto">Auto Detect</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Speaker Detection */}
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch 
                                                        checked={speakerDetection}
                                                        onChange={(e) => setSpeakerDetection(e.target.checked)}
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Person sx={{ color: 'text.secondary' }} />
                                                        <Typography>Speaker Detection</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Grid>

                                        {/* AI Model Selection */}
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>AI Model</InputLabel>
                                                <Select
                                                    value={aiModel}
                                                    onChange={(e) => setAiModel(e.target.value)}
                                                    label="AI Model"
                                                >
                                                    <MenuItem value="fast">Fast (Lower Accuracy)</MenuItem>
                                                    <MenuItem value="balanced">Balanced</MenuItem>
                                                    <MenuItem value="accurate">Accurate (Slower)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        {/* Estimates */}
                                        <Grid item xs={12}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 1,
                                                color: 'text.secondary',
                                                mb: 1
                                            }}>
                                                <Timer sx={{ fontSize: 20 }} />
                                                <Typography variant="body2">
                                                    Estimated Processing Time: ~2 minutes
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Process Button */}
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                sx={{ 
                                                    height: 48,
                                                    textTransform: 'none',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Start Processing
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </ContentCard>
        </PageLayout>
    );
} 