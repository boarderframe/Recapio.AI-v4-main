"use client";

import { Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import PageLayout from './PageLayout';
import ContentCard from './ContentCard';
import PageToolbar from './PageToolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import { Tabs, Tab } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';

const adminTabs = [
    { label: 'Overview', path: '/admin', icon: <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} /> },
    { label: 'Transcript Types', path: '/admin/transcript-types', icon: <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} /> },
    { label: 'AI Models', path: '/admin/ai-models', icon: <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} /> },
    { label: 'Users', path: '/admin/users', icon: <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} /> },
    { label: 'Theme', path: '/admin/theme', icon: <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} /> }
];

function AdminToolbar({ currentTab, onTabChange }) {
    return (
        <PageToolbar>
            <Tabs 
                value={currentTab}
                onChange={onTabChange}
                variant="fullWidth"
                TabIndicatorProps={{ sx: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        minHeight: '48px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        color: 'text.primary',
                        borderBottom: '2px solid transparent'
                    },
                    '& .MuiTabs-indicator': {
                        display: 'none'
                    },
                    '& .Mui-selected': {
                        color: 'primary.main',
                        borderBottom: '2px solid',
                        borderColor: 'primary.main'
                    },
                    '& .MuiTab-root:not(.Mui-selected):hover': {
                        color: 'primary.main'
                    }
                }}
            >
                {adminTabs.map((tab) => (
                    <Tab 
                        key={tab.path}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {tab.icon}
                                {tab.label}
                            </Box>
                        }
                        value={tab.path}
                        disableRipple
                        disableTouchRipple
                    />
                ))}
            </Tabs>
        </PageToolbar>
    );
}

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { themeSettings } = useThemeSettings();

    // Find the current tab based on the pathname
    const currentTab = adminTabs.find(tab => {
        if (tab.path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(tab.path);
    })?.path || '/admin';

    const handleTabChange = (event, newPath) => {
        router.push(newPath);
    };

    return (
        <PageLayout
            title="Admin Dashboard"
            subtitle="Manage your application settings and configurations"
            toolbar={
                <AdminToolbar 
                    currentTab={currentTab} 
                    onTabChange={handleTabChange}
                />
            }
        >
            <ContentCard>
                {children}
            </ContentCard>
        </PageLayout>
    );
} 