import { Container, ContainerProps } from '@mui/material';
import React from 'react';

interface PageBodyProps extends ContainerProps {
  children: React.ReactNode;
}

export default function PageBody({ children, ...props }: PageBodyProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
} 