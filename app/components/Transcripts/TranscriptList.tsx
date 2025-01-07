import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Skeleton,
  Paper,
  Typography,
  Chip,
  Box,
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

interface TranscriptListProps {
  transcripts: Transcript[];
  isLoading: boolean;
}

export default function TranscriptList({ transcripts, isLoading }: TranscriptListProps) {
  if (isLoading) {
    return (
      <List>
        {[...Array(5)].map((_, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemIcon>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width="40%" />}
            />
          </ListItem>
        ))}
      </List>
    );
  }

  if (!transcripts.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No transcripts found
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {transcripts.map((transcript) => (
        <ListItem
          key={transcript.id}
          divider
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <TranscriptIcon color="primary" />
          </ListItemIcon>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" component="span">
                  {transcript.title}
                </Typography>
                {transcript.collection_id && (
                  <Chip
                    size="small"
                    icon={<CollectionIcon />}
                    label="Collection"
                    variant="outlined"
                  />
                )}
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography variant="body2" color="textSecondary" component="span">
                  {formatDistanceToNow(new Date(transcript.created_at), { addSuffix: true })}
                </Typography>
                {transcript.hashtags?.map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    icon={<TagIcon />}
                    label={tag}
                    variant="outlined"
                    sx={{ maxWidth: 120 }}
                  />
                ))}
              </Box>
            }
          />

          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="favorite">
              {transcript.favorite ? (
                <StarIcon color="warning" />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
            <IconButton edge="end" aria-label="more options">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
} 