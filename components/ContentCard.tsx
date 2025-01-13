import { Paper, PaperProps } from '@mui/material';

export default function ContentCard({ children, sx, ...props }: PaperProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}15`,
                    borderColor: 'primary.main'
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Paper>
    );
} 