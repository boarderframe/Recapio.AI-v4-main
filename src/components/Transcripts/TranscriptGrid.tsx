import {
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    Typography,
    Skeleton,
    Stack,
    Chip,
    Divider,
    Tooltip,
    alpha,
} from '@mui/material';
import {
    Star,
    MoreVert,
    CalendarToday,
} from '@mui/icons-material';
import * as MuiIcons from '@mui/icons-material';
import { useTranscriptConfig } from '../../hooks/useTranscriptConfig';
import type { Transcript } from '../../types/transcript';

interface TranscriptGridProps {
    transcripts: Transcript[];
    isLoading: boolean;
    onFavoriteClick?: (id: string) => void;
    onMoreClick?: (id: string) => void;
    onClick?: (id: string) => void;
}

export default function TranscriptGrid({
    transcripts,
    isLoading,
    onFavoriteClick,
    onMoreClick,
    onClick
}: TranscriptGridProps) {
    const { getTypeConfig, getTypeColor } = useTranscriptConfig();

    if (isLoading) {
        return (
            <Grid container spacing={3}>
                {Array.from({ length: 6 }, (_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="rectangular" height={24} width="60%" sx={{ mb: 1 }} />
                                <Skeleton variant="rectangular" height={20} width="40%" />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (!transcripts.length) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">No transcripts found</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {transcripts.map((transcript) => {
                const accentColor = getTypeColor(transcript.type);
                const typeConfig = getTypeConfig(transcript.type);
                const TypeIcon = MuiIcons[typeConfig.icon as keyof typeof MuiIcons] || MuiIcons.Description;
                
                return (
                    <Grid item xs={12} sm={6} md={4} key={transcript.id}>
                        <Card
                            onClick={() => onClick?.(transcript.id)}
                            sx={{
                                cursor: 'pointer',
                                position: 'relative',
                                borderLeft: `6px solid ${accentColor}`,
                                bgcolor: 'background.paper',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                minHeight: 280,
                                borderRadius: 2,
                                boxShadow: `0 2px 4px ${alpha(accentColor, 0.1)}`,
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                                {/* Title and Date */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.75,
                                        minWidth: 0
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {transcript.title}
                                    </Typography>
                                    <Stack 
                                        direction="row" 
                                        spacing={0.75} 
                                        alignItems="center"
                                    >
                                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                        >
                                            {transcript.date}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        bgcolor: alpha(accentColor, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TypeIcon sx={{ color: accentColor, fontSize: 24 }} />
                                </Box>
                            </Box>

                            <Divider />

                            {/* Body */}
                            <CardContent sx={{ p: 2, flex: 1 }}>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {transcript.summary || 'No summary available for this transcript.'}
                                </Typography>
                            </CardContent>

                            <Divider />

                            {/* Footer */}
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, bgcolor: alpha(accentColor, 0.02) }}>
                                {/* Type Chip */}
                                <Chip
                                    label={typeConfig.label}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(accentColor, 0.1),
                                        color: accentColor,
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        borderRadius: 1.5,
                                        px: 1
                                    }}
                                />

                                {/* Actions */}
                                <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                                    <Tooltip title={transcript.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFavoriteClick?.(transcript.id);
                                            }}
                                            sx={{
                                                color: transcript.isFavorite ? 'warning.main' : 'text.secondary',
                                            }}
                                        >
                                            <Star sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="More options">
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMoreClick?.(transcript.id);
                                            }}
                                            sx={{
                                                color: 'text.secondary',
                                            }}
                                        >
                                            <MoreVert sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}