'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Box, Tabs, Tab } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PaletteIcon from '@mui/icons-material/Palette';
import BugReportIcon from '@mui/icons-material/BugReport';

const adminTabs = [
    { label: 'Overview', path: '/admin/overview', icon: DashboardIcon },
    { label: 'Transcript Types', path: '/admin/transcript-types', icon: DescriptionIcon },
    { label: 'AI Models', path: '/admin/ai-models', icon: SmartToyIcon },
    { label: 'Theme', path: '/admin/theme', icon: PaletteIcon },
    { label: 'Testing', path: '/admin/testing', icon: BugReportIcon }
];

export default function AdminTabs() {
    const router = useRouter();
    const pathname = usePathname() || '/admin/overview';
    const currentTab = adminTabs.findIndex(tab => pathname.startsWith(tab.path));

    return (
        <Box sx={{ 
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
        }}>
            <Tabs 
                value={currentTab !== -1 ? currentTab : 0}
                onChange={(e, newValue) => router.push(adminTabs[newValue].path)}
                variant="fullWidth"
                sx={{
                    minHeight: 48,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        minHeight: 48,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'primary.main'
                        }
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'primary.main'
                    }
                }}
            >
                {adminTabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return (
                        <Tab
                            key={tab.path}
                            label={tab.label}
                            icon={<Icon sx={{ mb: 0.5 }} />}
                            iconPosition="start"
                            sx={{
                                gap: 1,
                                py: 1.5
                            }}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
} 