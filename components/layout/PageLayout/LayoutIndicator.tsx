import { Box, Chip, Stack, Tooltip } from '@mui/material';
import { LayoutType } from '@/lib/layout/config';
import { getVersionInfo, getDetailedVersionInfo } from '@/lib/version';
import { useState } from 'react';

interface LayoutIndicatorProps {
    layout: LayoutType;
}

const getLayoutColor = (layout: LayoutType) => {
    switch (layout) {
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

function formatDetailedInfo(info: ReturnType<typeof getDetailedVersionInfo>): string {
    const buildDate = new Date(info.buildTime).toLocaleString();
    const envSpecific = info.environment !== 'PRODUCTION' 
        ? `Build: #${info.buildNumber}`
        : '';

    return `
Version Information:
------------------
Version: ${info.version}
Base Version: ${info.baseVersion}
Environment: ${info.environment}
${envSpecific}
Built: ${buildDate}

Dependencies:
------------------
Next.js: ${info.dependencies.next}
React: ${info.dependencies.react}
MUI: ${info.dependencies.mui}

System:
------------------
Node: ${info.nodeVersion}
Platform: ${info.platform}
Architecture: ${info.arch}
    `.trim();
}

export default function LayoutIndicator({ layout }: LayoutIndicatorProps) {
    if (process.env.NODE_ENV === 'production') return null;

    const versionInfo = getVersionInfo();
    const [showDetails, setShowDetails] = useState(false);
    const detailedInfo = getDetailedVersionInfo();

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 9999,
            }}
        >
            <Stack direction="row" spacing={1}>
                <Tooltip 
                    title={formatDetailedInfo(detailedInfo)}
                    open={showDetails}
                    onClose={() => setShowDetails(false)}
                    onClick={() => setShowDetails(!showDetails)}
                    arrow
                    placement="top-end"
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            maxWidth: 'none',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre',
                            fontSize: '0.875rem',
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            border: 1,
                            borderColor: 'divider',
                            p: 2,
                            borderRadius: 1,
                        }
                    }}
                >
                    <Chip
                        label={versionInfo.version}
                        color="info"
                        variant="filled"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.9,
                            },
                        }}
                    />
                </Tooltip>
                <Chip
                    label={`Layout: ${layout}`}
                    color={getLayoutColor(layout)}
                    variant="filled"
                    size="small"
                    sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: 2,
                    }}
                />
                <Chip
                    label={versionInfo.environment}
                    color="warning"
                    variant="filled"
                    size="small"
                    sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: 2,
                    }}
                />
            </Stack>
        </Box>
    );
} 