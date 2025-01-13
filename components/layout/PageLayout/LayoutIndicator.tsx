import { Box, Chip } from '@mui/material';
import { LayoutType } from '@/lib/layout/config';

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

export default function LayoutIndicator({ layout }: LayoutIndicatorProps) {
    if (process.env.NODE_ENV === 'production') return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 9999,
            }}
        >
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
        </Box>
    );
} 