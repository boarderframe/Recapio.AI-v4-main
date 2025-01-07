'use client';

import { useState } from 'react';
import { Box, Grid, Typography, Slider, TextField, Button, Alert, Divider } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import { useThemeSettings } from '@/context/ThemeContext';

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
    const { 
        themeSettings, 
        updateSpacing, 
        updateHeader, 
        updateContent,
        resetToDefaults,
        saveThemeSettings 
    } = useThemeSettings();

    const [spacing, setSpacing] = useState(themeSettings.spacing);
    const [header, setHeader] = useState(themeSettings.header);
    const [content, setContent] = useState(themeSettings.content);
    const [navigation, setNavigation] = useState(themeSettings.navigation);
    const [saveStatus, setSaveStatus] = useState({ show: false, type: 'success', message: '' });

    const handleSpacingChange = (key) => (event, value) => {
        const newSpacing = { ...spacing, [key]: value };
        setSpacing(newSpacing);
        updateSpacing(newSpacing);
    };

    const handleHeaderChange = (key) => (event, value) => {
        const newValue = value ?? event.target.value;
        const newHeader = { ...header };
        
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            newHeader[parent] = { ...newHeader[parent], [child]: newValue };
        } else {
            newHeader[key] = newValue;
        }
        
        setHeader(newHeader);
        updateHeader(newHeader);
    };

    const handleContentChange = (key) => (event, value) => {
        const newContent = { ...content, [key]: value };
        setContent(newContent);
        updateContent(newContent);
    };

    const handleSave = async () => {
        try {
            await saveThemeSettings({
                spacing,
                header,
                content,
                navigation
            });
            setSaveStatus({
                show: true,
                type: 'success',
                message: 'Theme settings saved successfully!'
            });
        } catch (error) {
            setSaveStatus({
                show: true,
                type: 'error',
                message: 'Failed to save theme settings. Please try again.'
            });
        }
        setTimeout(() => setSaveStatus({ show: false, type: 'success', message: '' }), 3000);
    };

    const handleReset = () => {
        resetToDefaults();
        setSaveStatus({
            show: true,
            type: 'info',
            message: 'Theme settings reset to defaults.'
        });
        setTimeout(() => setSaveStatus({ show: false, type: 'success', message: '' }), 3000);
    };

    return (
        <Box>
            {saveStatus.show && (
                <Alert 
                    severity={saveStatus.type}
                    sx={{ mb: 2 }}
                    onClose={() => setSaveStatus({ show: false, type: 'success', message: '' })}
                >
                    {saveStatus.message}
                </Alert>
            )}
            
            <Grid container spacing={3}>
                {/* Layout & Spacing */}
                <Grid item xs={12} md={6}>
                    <ContentCard sx={{ height: '100%' }}>
                        <ThemeSection 
                            title="Layout & Spacing" 
                            subtitle="Control the overall layout and spacing of your application"
                        >
                            {/* Navigation & Header Spacing */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Page Spacing</Typography>
                                <SliderControl
                                    label="Navbar to Page Header Gap"
                                    value={spacing.navToHeaderGap}
                                    onChange={handleSpacingChange('navToHeaderGap')}
                                    min={0}
                                    max={10}
                                    step={1}
                                    unit="px"
                                    valueLabelFormat={(value) => `${value * 2}px`}
                                    helperText="Space between navigation bar and page header"
                                />
                                <SliderControl
                                    label="Page Header to Toolbar Gap"
                                    value={spacing.headerToToolbarGap}
                                    onChange={handleSpacingChange('headerToToolbarGap')}
                                    min={0}
                                    max={10}
                                    step={1}
                                    unit="px"
                                    valueLabelFormat={(value) => `${value * 2}px`}
                                    helperText="Space between page header and toolbar"
                                />
                                <SliderControl
                                    label="Toolbar to Content Gap"
                                    value={spacing.toolbarToContentGap}
                                    onChange={handleSpacingChange('toolbarToContentGap')}
                                    min={0}
                                    max={10}
                                    step={1}
                                    unit="px"
                                    valueLabelFormat={(value) => `${value * 2}px`}
                                    helperText="Space between toolbar and main content"
                                />
                                <SliderControl
                                    label="Content to Content Gap"
                                    value={spacing.contentGap}
                                    onChange={handleSpacingChange('contentGap')}
                                    min={0}
                                    max={10}
                                    step={1}
                                    unit="px"
                                    valueLabelFormat={(value) => `${value * 2}px`}
                                    helperText="Space between content elements"
                                />
                            </Box>
                        </ThemeSection>
                    </ContentCard>
                </Grid>

                {/* Typography */}
                <Grid item xs={12} md={6}>
                    <ContentCard sx={{ height: '100%' }}>
                        <ThemeSection 
                            title="Typography" 
                            subtitle="Configure text styles for headers and content"
                        >
                            {/* Title Typography */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" gutterBottom>Page Title</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <TextField
                                        label="Mobile Size"
                                        value={header.titleSize.xs}
                                        onChange={(e) => handleHeaderChange('titleSize.xs')(e)}
                                        helperText="Example: 1.75rem"
                                        size="small"
                                    />
                                    <TextField
                                        label="Desktop Size"
                                        value={header.titleSize.md}
                                        onChange={(e) => handleHeaderChange('titleSize.md')(e)}
                                        helperText="Example: 2rem"
                                        size="small"
                                    />
                                </Box>
                                <SliderControl
                                    label="Font Weight"
                                    value={header.titleWeight}
                                    onChange={handleHeaderChange('titleWeight')}
                                    min={300}
                                    max={900}
                                    step={100}
                                    helperText="Font weight of the title"
                                />
                            </Box>

                            {/* Subtitle Typography */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Page Subtitle</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <TextField
                                        label="Mobile Size"
                                        value={header.subtitleSize.xs}
                                        onChange={(e) => handleHeaderChange('subtitleSize.xs')(e)}
                                        helperText="Example: 0.95rem"
                                        size="small"
                                    />
                                    <TextField
                                        label="Desktop Size"
                                        value={header.subtitleSize.md}
                                        onChange={(e) => handleHeaderChange('subtitleSize.md')(e)}
                                        helperText="Example: 1rem"
                                        size="small"
                                    />
                                </Box>
                                <SliderControl
                                    label="Font Weight"
                                    value={header.subtitleWeight}
                                    onChange={handleHeaderChange('subtitleWeight')}
                                    min={300}
                                    max={700}
                                    step={100}
                                    helperText="Font weight of the subtitle"
                                />
                            </Box>
                        </ThemeSection>
                    </ContentCard>
                </Grid>

                {/* Visual Style */}
                <Grid item xs={12}>
                    <ContentCard>
                        <ThemeSection 
                            title="Visual Style" 
                            subtitle="Customize the visual appearance of your interface"
                        >
                            <Grid container spacing={3}>
                                {/* Card Styling */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>Card Styling</Typography>
                                    <SliderControl
                                        label="Border Radius"
                                        value={content.borderRadius}
                                        onChange={(e, value) => {
                                            handleContentChange('borderRadius')(e, value);
                                            handleHeaderChange('borderRadius')(e, value);
                                        }}
                                        max={20}
                                        unit="px"
                                        helperText="Border radius of all cards (header, content, etc.)"
                                    />
                                    <PercentageSlider
                                        label="Border Opacity"
                                        value={parseFloat((content.borderColor || 'rgba(0, 0, 0, 0.05)').split(',')[3])}
                                        onChange={(e, value) => {
                                            const newBorderColor = `rgba(0, 0, 0, ${value})`;
                                            handleHeaderChange('borderColor')(e, newBorderColor);
                                            handleContentChange('borderColor')(e, newBorderColor);
                                        }}
                                        helperText="Opacity of all card borders"
                                    />
                                    <PercentageSlider
                                        label="Shadow Opacity"
                                        value={parseFloat((content.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.05)').split('rgba(0, 0, 0, ')[1].split(')')[0])}
                                        onChange={(e, value) => {
                                            const newBoxShadow = `0 2px 8px rgba(0, 0, 0, ${value})`;
                                            handleHeaderChange('boxShadow')(e, newBoxShadow);
                                            handleContentChange('boxShadow')(e, newBoxShadow);
                                        }}
                                        helperText="Opacity of all card shadows"
                                    />
                                </Grid>

                                {/* Header Accents */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>Header Accents</Typography>
                                    <PercentageSlider
                                        label="Underline Width"
                                        value={parseFloat(header.underlineWidth) / 100}
                                        onChange={(e, value) => handleHeaderChange('underlineWidth')(e, `${value * 100}%`)}
                                        helperText="Width of the title underline"
                                    />
                                    <PercentageSlider
                                        label="Underline Opacity"
                                        value={header.underlineOpacity}
                                        onChange={handleHeaderChange('underlineOpacity')}
                                        helperText="Opacity of the title underline"
                                    />
                                </Grid>
                            </Grid>
                        </ThemeSection>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleReset}
                            >
                                Reset to Defaults
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </ContentCard>
                </Grid>
            </Grid>
        </Box>
    );
} 