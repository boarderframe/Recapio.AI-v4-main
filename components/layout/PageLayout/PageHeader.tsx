import { Box, Typography } from '@mui/material';
import { PageHeaderProps } from './types';

export default function PageHeader({ title, subtitle, toolbar }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          {title && (
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {toolbar && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: { xs: 2, sm: 0 }
          }}>
            {toolbar}
          </Box>
        )}
      </Box>
    </Box>
  );
} 