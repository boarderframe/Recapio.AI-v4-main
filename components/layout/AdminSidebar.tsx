'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
    Box, 
    List, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    Typography,
    Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PaletteIcon from '@mui/icons-material/Palette';
import BugReportIcon from '@mui/icons-material/BugReport';
import { getVersionInfo } from '@/lib/version';

const adminRoutes = [
    { label: 'Overview', path: '/admin/overview', icon: DashboardIcon },
    { label: 'Transcript Types', path: '/admin/transcript-types', icon: DescriptionIcon },
    { label: 'AI Models', path: '/admin/ai-models', icon: SmartToyIcon },
    { label: 'Theme', path: '/admin/theme', icon: PaletteIcon },
    { label: 'Testing', path: '/admin/testing', icon: BugReportIcon }
];

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname() || '/admin/overview';
    const versionInfo = getVersionInfo();

    return (
        <Box
            sx={{
                width: 280,
                bgcolor: 'background.paper',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            }}
        >
            <Box 
                sx={{ 
                    p: 3,
                    pt: 8,
                    pb: 0,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    bgcolor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    minHeight: 120
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        opacity: 0.9,
                        mb: 2,
                        textAlign: 'left'
                    }}
                >
                    Admin Console
                </Typography>
            </Box>
            
            <Box sx={{ flex: 1, overflowY: 'auto', mt: 2 }}>
                <List 
                    component="nav"
                    sx={{
                        px: 3,
                        py: 1,
                        '& .MuiListItemButton-root': {
                            borderRadius: 1.5,
                            mb: 1,
                            transition: 'all 0.2s ease-in-out',
                            py: 1.25,
                        },
                    }}
                >
                    {adminRoutes.map((route) => {
                        const Icon = route.icon;
                        const isSelected = pathname.startsWith(route.path);
                        
                        return (
                            <ListItemButton
                                key={route.path}
                                selected={isSelected}
                                onClick={() => router.push(route.path)}
                                sx={{
                                    minHeight: 44,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: isSelected ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: 36,
                                        color: isSelected ? 'inherit' : 'text.primary',
                                        opacity: isSelected ? 1 : 0.7,
                                    }}
                                >
                                    <Icon sx={{ fontSize: '1.25rem' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={route.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.9375rem',
                                        fontWeight: isSelected ? 600 : 500,
                                        letterSpacing: '-0.01em',
                                        textAlign: 'center'
                                    }}
                                    sx={{ textAlign: 'center' }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            <Box 
                sx={{ 
                    p: 3,
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    bgcolor: 'transparent',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{ 
                        color: 'text.secondary',
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        opacity: 0.6,
                        letterSpacing: '0.02em',
                    }}
                >
                    {versionInfo.version} • {versionInfo.environment}
                </Typography>
            </Box>
        </Box>
    );
} 