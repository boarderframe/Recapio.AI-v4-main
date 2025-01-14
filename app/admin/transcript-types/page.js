'use client';

import { useState } from 'react';
import { Box, Paper, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ContentCard from '@/components/ContentCard';
import TableControls from '@/components/TableControls';

export default function TranscriptTypesPage() {
    const [filters, setFilters] = useState({
        search: '',
        columns: [],
        density: 'medium'
    });

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    return (
        <Box sx={{ pb: 4 }}>
            <ContentCard sx={{ p: 0 }}>
                <TableControls
                    onSearch={handleSearch}
                    searchPlaceholder="Search transcript types..."
                />

                {/* Table Header */}
                <Box 
                    sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: 2,
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
                    }}
                >
                    <Box sx={{ fontWeight: 600, color: 'text.primary' }}>Category</Box>
                    <Box sx={{ fontWeight: 600, color: 'text.primary' }}>Type</Box>
                    <Box sx={{ fontWeight: 600, color: 'text.primary' }}>Sub Type</Box>
                    <Box sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</Box>
                </Box>

                {/* Empty State */}
                <Box 
                    sx={{ 
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        gap: 1
                    }}
                >
                    <Box sx={{ fontSize: '0.95rem' }}>No transcript types found</Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.disabled' }}>
                        Add a new transcript type to get started
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 2,
                    mt: 3,
                    px: 3,
                    pb: 3
                }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}
                    >
                        Add New Type
                    </Button>
                </Box>
            </ContentCard>
        </Box>
    );
} 