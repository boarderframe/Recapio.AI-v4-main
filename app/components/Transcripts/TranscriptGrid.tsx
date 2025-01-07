import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Description as TranscriptIcon,
  Tag as TagIcon,
  Folder as CollectionIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { Transcript } from '@/app/hooks/useTranscripts';

interface TranscriptGridProps {
  transcripts: Transcript[];
  isLoading: boolean;
}

export default function TranscriptGrid({ transcripts, isLoading }: TranscriptGridProps) {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" height={24} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={20} width="40%" />
              </CardContent>
              <CardActions>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!transcripts.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No transcripts found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {transcripts.map((transcript) => (
        <Grid item xs={12} sm={6} md={4} key={transcript.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <TranscriptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {transcript.title}
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  {formatDistanceToNow(new Date(transcript.created_at), { addSuffix: true })}
                </Typography>

                {transcript.collection_id && (
                  <Chip
                    size="small"
                    icon={<CollectionIcon />}
                    label="Collection"
                    variant="outlined"
                  />
                )}

                {transcript.hashtags && transcript.hashtags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {transcript.hashtags.map((tag) => (
                      <Chip
                        key={tag}
                        size="small"
                        icon={<TagIcon />}
                        label={tag}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Stack>
            </CardContent>

            <CardActions disableSpacing>
              <IconButton aria-label="favorite">
                {transcript.favorite ? (
                  <StarIcon color="warning" />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton aria-label="more options">
                <MoreVertIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 