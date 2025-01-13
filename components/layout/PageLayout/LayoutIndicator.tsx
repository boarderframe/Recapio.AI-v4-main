import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { getVersionInfo, getVersionString, getEnvironmentString } from '@/lib/version';

interface LayoutIndicatorProps {
    layout: string;
}

// Color mapping for different layout types
const getLayoutColor = (layout: string) => {
    switch (layout.toLowerCase()) {
        case 'marketing':
            return 'primary';
        case 'auth':
            return 'secondary';
        case 'app':
            return 'success';
        case 'admin':
            return 'error';
        default:
            return 'default';
    }
};

// Layout descriptions
const getLayoutDescription = (layout: string) => {
    switch (layout.toLowerCase()) {
        case 'marketing':
            return {
                description: 'Public marketing pages and landing pages',
                features: [
                    'Public access',
                    'SEO optimized',
                    'High performance',
                    'Marketing analytics',
                    'Lead capture forms'
                ],
                routing: '/marketing/*',
                auth: 'No authentication required'
            };
        case 'auth':
            return {
                description: 'Authentication and authorization pages',
                features: [
                    'Login/Signup flows',
                    'Password recovery',
                    'OAuth providers',
                    'MFA support',
                    'Session management'
                ],
                routing: '/auth/*',
                security: 'Enhanced security measures'
            };
        case 'app':
            return {
                description: 'Main application interface for logged-in users',
                features: [
                    'Full app functionality',
                    'User dashboard',
                    'Real-time updates',
                    'Data management',
                    'User preferences'
                ],
                routing: '/app/*',
                auth: 'Requires authentication'
            };
        case 'admin':
            return {
                description: 'Administrative dashboard and controls',
                features: [
                    'System management',
                    'User administration',
                    'Analytics dashboard',
                    'Configuration controls',
                    'Audit logging'
                ],
                routing: '/admin/*',
                auth: 'Requires admin privileges'
            };
        default:
            return {
                description: 'Custom layout type',
                features: ['Custom implementation'],
                routing: '/*',
                auth: 'Varies'
            };
    }
};

// Environment details
const getEnvironmentDetails = (env: string) => {
    const versionInfo = getVersionInfo();
    const buildDate = new Date(versionInfo.buildTime).toLocaleString();
    
    switch (env.toLowerCase()) {
        case 'production':
            return (
                <Box sx={{ p: 1.5, maxWidth: 300 }}>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
                        Production Environment
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        • Live system - Stable release
                        <br/>• Strict security controls
                        <br/>• Performance optimized
                        <br/>• CDN enabled
                        <br/>• Error tracking active
                        <br/>• Analytics enabled
                        <br/>• Auto-scaling enabled
                        <br/>• Built: {buildDate}
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                        Status:
                        <br/>• Cache: Enabled
                        <br/>• SSL: Enforced
                        <br/>• Monitoring: Active
                    </Typography>
                </Box>
            );
        case 'development':
            return (
                <Box sx={{ p: 1.5, maxWidth: 300 }}>
                    <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 500 }}>
                        Development Environment
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        • Debug mode enabled
                        <br/>• Hot reloading active
                        <br/>• Error reporting verbose
                        <br/>• API mocking available
                        <br/>• Test data enabled
                        <br/>• Build #{versionInfo.buildNumber}
                        <br/>• Built: {buildDate}
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                        Dev Tools:
                        <br/>• React DevTools
                        <br/>• Network Inspector
                        <br/>• Performance Monitor
                    </Typography>
                </Box>
            );
        case 'staging':
            return (
                <Box sx={{ p: 1.5, maxWidth: 300 }}>
                    <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 500 }}>
                        Staging Environment
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        • Pre-production testing
                        <br/>• QA verification
                        <br/>• Integration testing
                        <br/>• Performance testing
                        <br/>• Security scanning
                        <br/>• Build #{versionInfo.buildNumber}
                        <br/>• Built: {buildDate}
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                        Monitoring:
                        <br/>• Error tracking
                        <br/>• Performance metrics
                        <br/>• Test coverage
                    </Typography>
                </Box>
            );
        default:
            return (
                <Box sx={{ p: 1.5, maxWidth: 300 }}>
                    <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                        Environment: {env}
                        <br/>Build #{versionInfo.buildNumber}
                        <br/>Built: {buildDate}
                        <br/>Status: Custom configuration
                    </Typography>
                </Box>
            );
    }
};

// Layout info tooltip
const getLayoutTooltip = (layout: string) => {
    const info = getLayoutDescription(layout);
    return (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {layout.toUpperCase()} Layout
            </Typography>
            <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.secondary' }}>
                {info.description}
            </Typography>
            
            <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                Features:
            </Typography>
            <Typography variant="caption" component="div" sx={{ ml: 1, color: 'text.secondary' }}>
                {info.features.map((feature, index) => (
                    <span key={index}>• {feature}<br/></span>
                ))}
            </Typography>
            
            <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                Configuration:
            </Typography>
            <Typography variant="caption" component="div" sx={{ ml: 1, color: 'text.secondary' }}>
                • Route: {info.routing}<br/>
                • Auth: {info.auth}
            </Typography>
        </Box>
    );
};

export default function LayoutIndicator({ layout }: LayoutIndicatorProps) {
    const versionInfo = getVersionInfo();
    
    // Format version info tooltip
    const versionTooltip = (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 500 }}>
                Version Information
            </Typography>
            
            <Typography variant="caption" component="div" sx={{ mt: 0.5, color: 'text.secondary' }}>
                • Version: {versionInfo.version}
                <br/>• Environment: {versionInfo.environment}
                <br/>• Build #{versionInfo.buildNumber}
                <br/>• Built: {new Date(versionInfo.buildTime).toLocaleString()}
            </Typography>
            
            <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                Dependencies:
                <br/>• Node: {versionInfo.dependencies.node}
                <br/>• Next.js: {versionInfo.dependencies.next}
                <br/>• React: {versionInfo.dependencies.react}
                <br/>• MUI: {versionInfo.dependencies.mui}
            </Typography>
            
            <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                System:
                <br/>• Platform: {versionInfo.system.platform} ({versionInfo.system.arch})
                <br/>• Memory: {versionInfo.system.memory}
                <br/>• CPUs: {versionInfo.system.cpus}
            </Typography>
        </Box>
    );

    // Layout info tooltip
    const layoutInfo = getLayoutTooltip(layout);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
            }}
        >
            <Stack direction="row" spacing={1}>
                <Tooltip
                    title={versionTooltip}
                    arrow
                    placement="top-end"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                                '& .MuiTooltip-arrow': {
                                    color: 'background.paper',
                                },
                            },
                        },
                    }}
                >
                    <Chip
                        label={versionInfo.version}
                        size="small"
                        color="info"
                        variant="filled"
                        sx={{
                            fontWeight: 500,
                            cursor: 'help',
                        }}
                    />
                </Tooltip>
                
                <Tooltip
                    title={layoutInfo}
                    arrow
                    placement="top"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                                '& .MuiTooltip-arrow': {
                                    color: 'background.paper',
                                },
                            },
                        },
                    }}
                >
                    <Chip
                        label={`LAYOUT: ${layout.toUpperCase()}`}
                        size="small"
                        color={getLayoutColor(layout)}
                        variant="filled"
                        sx={{
                            fontWeight: 500,
                            cursor: 'help',
                        }}
                    />
                </Tooltip>
                
                <Tooltip
                    title={getEnvironmentDetails(versionInfo.environment)}
                    arrow
                    placement="top-start"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                                '& .MuiTooltip-arrow': {
                                    color: 'background.paper',
                                },
                            },
                        },
                    }}
                >
                    <Chip
                        label={getEnvironmentString()}
                        size="small"
                        color={versionInfo.environment === 'PRODUCTION' ? 'success' : 'warning'}
                        variant="filled"
                        sx={{
                            fontWeight: 500,
                            cursor: 'help',
                        }}
                    />
                </Tooltip>
            </Stack>
        </Box>
    );
} 