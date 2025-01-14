'use client';

import { Box, Grid, Paper, Typography, Divider, Chip } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import { 
    PeopleAlt, Description, SmartToy, Palette, BugReport, 
    Memory, Storage, Speed, Update, Architecture,
    Settings, ViewQuilt, Layers, Code, CloudUpload,
    Timer, DataUsage, Api
} from '@mui/icons-material';
import { getVersionInfo } from '@/lib/version';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid',
            borderColor: (theme) => theme.palette.divider,
            borderRadius: 3,
            bgcolor: 'background.paper',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
                borderColor: (theme) => theme.palette[color].main,
            }
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: `${color}.main`,
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? `${color}.darker`
                        : `${color}.lighter`,
                    flexShrink: 0
                }}
            >
                <Icon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        mb: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {value}
                </Typography>
                {subtitle && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
        <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mt: 'auto'
            }}
        >
            {title}
        </Typography>
    </Paper>
);

const SectionTitle = ({ icon: Icon, title }) => (
    <Box 
        sx={{ 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 0.5
        }}
    >
        <Icon 
            sx={{ 
                color: 'text.secondary',
                fontSize: 24
            }} 
        />
        <Typography 
            variant="h5" 
            sx={{
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '1.25rem',
                lineHeight: 1.4
            }}
        >
            {title}
        </Typography>
    </Box>
);

export default function OverviewPage() {
    const versionInfo = getVersionInfo();
    const buildDate = new Date(versionInfo.buildTime).toLocaleString();

    return (
        <Box sx={{ pb: 4 }}>
            <ContentCard sx={{ p: 3 }}>
                {/* Version Banner */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip 
                            icon={<Update />}
                            label={`v${versionInfo.version}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                        <Chip 
                            icon={<Settings />}
                            label={versionInfo.environment}
                            color={versionInfo.environment === 'DEVELOPMENT' ? 'warning' : 'success'}
                            variant="outlined"
                            size="small"
                        />
                        <Chip 
                            icon={<Code />}
                            label={`Node ${versionInfo.dependencies.node}`}
                            color="default"
                            variant="outlined"
                            size="small"
                        />
                        <Chip 
                            icon={<Api />}
                            label={`Next ${versionInfo.dependencies.next}`}
                            color="default"
                            variant="outlined"
                            size="small"
                        />
                        <Chip 
                            icon={<Code />}
                            label={`React ${versionInfo.dependencies.react}`}
                            color="default"
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                    <Divider />
                </Box>

                {/* System Status */}
                <Box sx={{ mb: 5 }}>
                    <SectionTitle icon={Memory} title="System Status" />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="System Load"
                                value="45%"
                                subtitle={`${versionInfo.system.cpus} Cores`}
                                icon={Memory}
                                color="error"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Memory"
                                value="16GB"
                                subtitle="Total RAM"
                                icon={Storage}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Build"
                                value={`#${versionInfo.buildNumber}`}
                                subtitle={buildDate}
                                icon={Update}
                                color="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Platform"
                                value={versionInfo.system.platform}
                                subtitle={versionInfo.system.arch}
                                icon={Architecture}
                                color="success"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Transcript Management */}
                <Box sx={{ mb: 5 }}>
                    <SectionTitle icon={Description} title="Transcript Types" />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Manage transcript categories and types
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Categories"
                                value="8"
                                subtitle="Active Categories"
                                icon={Description}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Transcripts"
                                value="1,234"
                                subtitle="Total Processed"
                                icon={Description}
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Processing Time"
                                value="2.5s"
                                subtitle="Average"
                                icon={Timer}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Storage Used"
                                value="45GB"
                                subtitle="Of 100GB"
                                icon={CloudUpload}
                                color="error"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* AI Models */}
                <Box sx={{ mb: 5 }}>
                    <SectionTitle icon={SmartToy} title="AI Models" />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Configure and manage AI model settings
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Active Models"
                                value="15"
                                subtitle="Configured Models"
                                icon={SmartToy}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Model Types"
                                value="4"
                                subtitle="Categories"
                                icon={Layers}
                                color="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Response Time"
                                value="1.2s"
                                subtitle="Average"
                                icon={Speed}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Success Rate"
                                value="99.9%"
                                subtitle="Last 24h"
                                icon={DataUsage}
                                color="success"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Layout Info */}
                <Box>
                    <SectionTitle icon={ViewQuilt} title="Layout Information" />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Layout Types"
                                value="5"
                                subtitle="Active Templates"
                                icon={ViewQuilt}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Components"
                                value="24"
                                subtitle="Reusable"
                                icon={Layers}
                                color="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Theme Presets"
                                value="4"
                                subtitle="Custom Themes"
                                icon={Palette}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Test Coverage"
                                value="85%"
                                subtitle="156 Tests"
                                icon={BugReport}
                                color="success"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </ContentCard>
        </Box>
    );
} 