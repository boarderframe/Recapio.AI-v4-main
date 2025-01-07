import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import BaseModelModal from './BaseModelModal';

const FeatureCard = ({ icon, title, description }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out',
            },
        }}
    >
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="h6" color="primary">
                {icon}
            </Typography>
            <Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box>
        </Box>
    </Paper>
);

const PricingTag = ({ input, output }) => (
    <Chip
        label={`Input: $${input}/1K tokens • Output: $${output}/1K tokens`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ borderRadius: 2 }}
    />
);

export default function OpenAIModelModal({ open, onClose, model }) {
    if (!model) return null;

    const getPricingInfo = (modelId) => {
        const id = modelId.toLowerCase();
        if (id.includes('gpt-4')) {
            return id.includes('32k') ? 
                { input: '0.06', output: '0.12' } : 
                { input: '0.03', output: '0.06' };
        } else if (id.includes('gpt-3.5')) {
            return id.includes('16k') ? 
                { input: '0.003', output: '0.004' } : 
                { input: '0.0015', output: '0.002' };
        }
        return null;
    };

    const pricing = getPricingInfo(model.id);

    return (
        <BaseModelModal open={open} onClose={onClose}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {model.id}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {model.description || `A ${model.type?.toLowerCase() || 'machine learning'} model by OpenAI`}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                        <Chip
                            label={model.status}
                            size="small"
                            color={model.status === 'Active' ? 'success' : 'warning'}
                        />
                        {pricing && <PricingTag input={pricing.input} output={pricing.output} />}
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <FeatureCard
                        icon="🔄"
                        title="Context Length"
                        description={model.context_length ? `${(model.context_length / 1000).toFixed(1)}k tokens` : 'Not specified'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FeatureCard
                        icon="📚"
                        title="Training Data"
                        description={model.training_data || 'Not specified'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FeatureCard
                        icon="⚡"
                        title="Model Type"
                        description={model.type || 'Not specified'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FeatureCard
                        icon="🏢"
                        title="Provider"
                        description="OpenAI"
                    />
                </Grid>
            </Grid>

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2">
                        Model Information
                    </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body2">
                            {new Date(model.created * 1000).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Model ID</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {model.id}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </BaseModelModal>
    );
} 