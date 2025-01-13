'use client';

import { Box, Typography } from '@mui/material';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '/admin/overview';
    
    // Get the current tab name based on the pathname
    const getTabName = () => {
        const path = pathname.split('/').pop() || '';
        return path.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AdminSidebar />
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: '280px',
                    p: 4,
                    pt: 8,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: 'text.primary',
                        letterSpacing: '-0.02em',
                        fontSize: '1.75rem',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            width: '40%',
                            height: 2,
                            bgcolor: 'primary.main',
                            borderRadius: 1
                        }
                    }}
                >
                    {getTabName()}
                </Typography>
                {children}
            </Box>
        </Box>
    );
} 