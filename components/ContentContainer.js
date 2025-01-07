"use client";

import { Container } from '@mui/material';

export default function ContentContainer({ children, noPadding }) {
    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 0,
                px: { xs: 2, sm: 3 },
            }}
        >
            {children}
        </Container>
    );
} 