"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, IconButton, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';
import { Psychology, RestartAlt } from '@mui/icons-material';
import { useThemeSettings } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function NewTranscriptPage() {
    const { themeSettings } = useThemeSettings();
    const [formData, setFormData] = useState({
        category: '',
        type: '',
        subType: '',
        title: '',
        transcriptText: ''
    });
    const [transcriptTypes, setTranscriptTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTranscriptTypes();
    }, []);

    const fetchTranscriptTypes = async () => {
        try {
            setLoading(true);
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

            setTranscriptTypes(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            
            // Reset dependent fields when parent field changes
            if (field === 'category') {
                newData.type = '';
                newData.subType = '';
            } else if (field === 'type') {
                newData.subType = '';
            }
            
            return newData;
        });
    };

    const handleReset = () => {
        setFormData({
            category: '',
            type: '',
            subType: '',
            title: '',
            transcriptText: ''
        });
    };

    const handleSubmit = () => {
        console.log('Processing transcript:', formData);
    };

    // Get unique categories
    const categories = [...new Set(transcriptTypes.map(tt => tt.category))];
    
    // Get types for selected category
    const types = [...new Set(transcriptTypes
        .filter(tt => tt.category === formData.category)
        .map(tt => tt.type))];
    
    // Get sub-types for selected category and type
    const subTypes = transcriptTypes
        .filter(tt => tt.category === formData.category && tt.type === formData.type)
        .map(tt => tt.sub_type);

    return (
        <PageLayout
            layout="app"
            title="New Transcript"
            subtitle="Create a new transcript by entering text below"
            toolbar={
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Psychology />}
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.transcriptText}
                    >
                        Process Transcript
                    </Button>
                </Box>
            }
        >
            <ContentCard>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Row 1: Category, Type, SubType with Reset */}
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    color: 'text.secondary'
                                }}
                            >
                                Category
                            </Typography>
                            <Select
                                fullWidth
                                value={formData.category}
                                onChange={handleChange('category')}
                                displayEmpty
                                disabled={loading}
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    color: 'text.secondary'
                                }}
                            >
                                Type
                            </Typography>
                            <Select
                                fullWidth
                                value={formData.type}
                                onChange={handleChange('type')}
                                displayEmpty
                                disabled={!formData.category || loading}
                            >
                                <MenuItem value="">Select Type</MenuItem>
                                {types.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    color: 'text.secondary'
                                }}
                            >
                                Sub-Type
                            </Typography>
                            <Select
                                fullWidth
                                value={formData.subType}
                                onChange={handleChange('subType')}
                                displayEmpty
                                disabled={!formData.type || loading}
                            >
                                <MenuItem value="">Select Sub-Type</MenuItem>
                                {subTypes.map((subType) => (
                                    <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <IconButton 
                            onClick={handleReset}
                            sx={{ 
                                mt: 3,
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            <RestartAlt />
                        </IconButton>
                    </Box>

                    {/* Row 2: Title */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 500,
                                color: 'text.secondary'
                            }}
                        >
                            Title
                        </Typography>
                        <TextField
                            fullWidth
                            value={formData.title}
                            onChange={handleChange('title')}
                            placeholder="Enter transcript title"
                            variant="outlined"
                        />
                    </Box>

                    {/* Row 3: Transcript Text */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 500,
                                color: 'text.secondary'
                            }}
                        >
                            Transcript Text
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            value={formData.transcriptText}
                            onChange={handleChange('transcriptText')}
                            placeholder="Enter or paste your transcript text here"
                            variant="outlined"
                        />
                    </Box>

                    {/* Row 4: Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Psychology />}
                            onClick={handleSubmit}
                            disabled={!formData.transcriptText}
                        >
                            Process Transcript
                        </Button>
                    </Box>
                </Box>
            </ContentCard>
        </PageLayout>
    );
} 