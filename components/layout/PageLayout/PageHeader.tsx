import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  if (!title && !subtitle) return null;

  return (
    <Box
      component="header"
      sx={{
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      {title && (
        <Typography variant="h4" component="h1" fontWeight={600}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
} 