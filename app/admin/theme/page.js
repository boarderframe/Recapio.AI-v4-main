'use client';

import { useState } from 'react';
import { Box, Grid, Typography, Slider, TextField, Button, Alert, Divider, CircularProgress } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import { useThemeSettings } from '@/context/ThemeContext';
import { Save, RestartAlt } from '@mui/icons-material';

const ThemeSection = ({ title, subtitle, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {subtitle}
            </Typography>
        )}
        {children}
    </Box>
);

const SliderControl = ({ label, value, onChange, min = 0, max = 10, step = 1, unit = '', helperText = '', valueLabelFormat }) => (
    <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.primary">{label}</Typography>
            <Typography variant="body2" color="text.secondary">{value}{unit}</Typography>
        </Box>
        <Slider
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}
        />
        {helperText && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {helperText}
            </Typography>
        )}
    </Box>
);

const PercentageSlider = ({ label, value, onChange, helperText }) => (
    <SliderControl
        label={label}
        value={value * 100}
        onChange={(e, newValue) => onChange(e, newValue / 100)}
        min={0}
        max={100}
        step={5}
        unit="%"
        helperText={helperText}
    />
);

export default function ThemePage() {
    const { themeSettings, updateThemeSettings } = useThemeSettings();
    const [message, setMessage] = useState({ type: '', content: '' });
    const [loading, setLoading] = useState(false);

    const handleSpacingChange = (key) => (event, value) => {
        const newSpacing = { ...themeSettings.spacing, [key]: value };
        updateThemeSettings({ spacing: newSpacing });
    };

    const handleHeaderChange = (key) => (event, value) => {
        const newValue = value ?? event.target.value;
        const newHeader = { ...themeSettings.header };
        
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            newHeader[parent] = { ...newHeader[parent], [child]: newValue };
        } else {
            newHeader[key] = newValue;
        }
        
        updateThemeSettings({ header: newHeader });
    };

    const handleContentChange = (key) => (event, value) => {
        const newContent = { ...themeSettings.content, [key]: value };
        updateThemeSettings({ content: newContent });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateThemeSettings({
                spacing: themeSettings.spacing,
                header: themeSettings.header,
                content: themeSettings.content,
                navigation: themeSettings.navigation
            });
            setMessage({
                type: 'success',
                content: 'Theme settings saved successfully!'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                content: 'Failed to save theme settings. Please try again.'
            });
        }
        setLoading(false);
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    };

    const handleReset = () => {
        updateThemeSettings({
            spacing: {
                navToHeaderGap: 0,
                headerToToolbarGap: 0,
                toolbarToContentGap: 0,
                contentGap: 0,
                borderRadius: 0,
                borderOpacity: 0.05,
                boxShadowOpacity: 0.05
            },
            header: {
                titleSize: { xs: 1.75, md: 2 },
                subtitleSize: { xs: 0.95, md: 1 },
                titleWeight: 700,
                subtitleWeight: 500,
                underlineWidth: 0,
                underlineOpacity: 0.5
            },
            content: {
                borderRadius: 0,
                borderOpacity: 0.05,
                boxShadowOpacity: 0.05
            },
            navigation: {}
        });
        setMessage({
            type: 'info',
            content: 'Theme settings reset to defaults.'
        });
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    };

    return (
        <Box>
            <ContentCard>
                {message.type && (
                    <Alert severity={message.type} sx={{ mb: 4 }}>
                        {message.content}
                    </Alert>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <ThemeSection
                            title="Spacing & Layout"
                            subtitle="Adjust the spacing between different elements of the page"
                        >
                            <SliderControl
                                label="Navigation to Header Gap"
                                value={themeSettings.spacing.navToHeaderGap}
                                onChange={handleSpacingChange('navToHeaderGap')}
                                helperText="Space between navigation and header section"
                            />
                            <SliderControl
                                label="Content Gap"
                                value={themeSettings.spacing.contentGap}
                                onChange={handleSpacingChange('contentGap')}
                                helperText="Space between content sections"
                            />
                            <SliderControl
                                label="Border Radius"
                                value={themeSettings.spacing.borderRadius}
                                onChange={handleSpacingChange('borderRadius')}
                                helperText="Roundness of corners for cards and containers"
                            />
                            <PercentageSlider
                                label="Border Opacity"
                                value={themeSettings.spacing.borderOpacity}
                                onChange={handleSpacingChange('borderOpacity')}
                                helperText="Visibility of borders around elements"
                            />
                            <PercentageSlider
                                label="Box Shadow Opacity"
                                value={themeSettings.spacing.boxShadowOpacity}
                                onChange={handleSpacingChange('boxShadowOpacity')}
                                helperText="Intensity of shadows under elements"
                            />
                        </ThemeSection>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ThemeSection
                            title="Header Styling"
                            subtitle="Customize the appearance of page headers"
                        >
                            <SliderControl
                                label="Title Size (Mobile)"
                                value={themeSettings.header.titleSize.xs}
                                onChange={handleHeaderChange('titleSize.xs')}
                                min={1}
                                max={3}
                                step={0.05}
                                unit="rem"
                                helperText="Size of page titles on mobile devices"
                            />
                            <SliderControl
                                label="Title Size (Desktop)"
                                value={themeSettings.header.titleSize.md}
                                onChange={handleHeaderChange('titleSize.md')}
                                min={1}
                                max={3}
                                step={0.05}
                                unit="rem"
                                helperText="Size of page titles on desktop devices"
                            />
                            <SliderControl
                                label="Subtitle Size (Mobile)"
                                value={themeSettings.header.subtitleSize.xs}
                                onChange={handleHeaderChange('subtitleSize.xs')}
                                min={0.8}
                                max={2}
                                step={0.05}
                                unit="rem"
                                helperText="Size of page subtitles on mobile devices"
                            />
                            <SliderControl
                                label="Subtitle Size (Desktop)"
                                value={themeSettings.header.subtitleSize.md}
                                onChange={handleHeaderChange('subtitleSize.md')}
                                min={0.8}
                                max={2}
                                step={0.05}
                                unit="rem"
                                helperText="Size of page subtitles on desktop devices"
                            />
                            <SliderControl
                                label="Title Weight"
                                value={themeSettings.header.titleWeight}
                                onChange={handleHeaderChange('titleWeight')}
                                min={400}
                                max={900}
                                step={100}
                                helperText="Font weight of page titles"
                            />
                            <SliderControl
                                label="Subtitle Weight"
                                value={themeSettings.header.subtitleWeight}
                                onChange={handleHeaderChange('subtitleWeight')}
                                min={400}
                                max={900}
                                step={100}
                                helperText="Font weight of page subtitles"
                            />
                        </ThemeSection>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <ThemeSection
                            title="Content Styling"
                            subtitle="Adjust the appearance of content containers"
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <SliderControl
                                        label="Border Radius"
                                        value={themeSettings.content.borderRadius}
                                        onChange={handleContentChange('borderRadius')}
                                        helperText="Roundness of corners for content containers"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <PercentageSlider
                                        label="Border Opacity"
                                        value={themeSettings.content.borderOpacity}
                                        onChange={handleContentChange('borderOpacity')}
                                        helperText="Visibility of borders around content"
                                    />
                                </Grid>
                            </Grid>
                        </ThemeSection>
                    </Grid>
                </Grid>

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
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}
                    >
                        Reset to Defaults
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </ContentCard>
        </Box>
    );
} 