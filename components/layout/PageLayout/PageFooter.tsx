import { Box, Container, Typography } from '@mui/material';
import { PageFooterProps } from './types';
import clsx from 'clsx';
import { getVersionString } from '@/lib/version';

export default function PageFooter({ children, sticky = false, className }: PageFooterProps) {
  return (
    <Box
      component="footer"
      className={clsx('page-footer', className)}
      sx={{
        py: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        ...(sticky && {
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
        }),
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {children}
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            ml: 'auto',
            opacity: 0.8
          }}
        >
          {getVersionString()}
        </Typography>
      </Container>
    </Box>
  );
} 