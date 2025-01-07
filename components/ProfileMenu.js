"use client";

import { Menu, MenuItem, ListItemIcon, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function ProfileMenu({ anchorEl, open, onClose, user, onSignOut, onNavigate }) {
    console.log('User metadata:', user?.user_metadata);
    const displayName = user?.user_metadata?.display_name || 
        (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');

    // Get first name for welcome message
    const firstName = displayName.split(' ')[0];

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    mt: 1,
                    minWidth: 150,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                    '& .MuiMenuItem-root': {
                        px: 1.5,
                        py: 0.5,
                        fontSize: '14px',
                        minHeight: '28px',
                        gap: '12px'
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '18px'
                    },
                    '& .MuiList-root': {
                        py: 0.5
                    }
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ px: 1.5, py: 0.75 }}>
                <Typography sx={{ 
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'text.primary',
                }}>
                    Welcome, {firstName}
                </Typography>
            </Box>
            <MenuItem onClick={() => onNavigate('/profile')}>
                <ListItemIcon sx={{ minWidth: 'unset' }}>
                    <PersonIcon />
                </ListItemIcon>
                Profile
            </MenuItem>
            <MenuItem onClick={() => onNavigate('/settings')}>
                <ListItemIcon sx={{ minWidth: 'unset' }}>
                    <SettingsIcon />
                </ListItemIcon>
                Settings
            </MenuItem>
            <MenuItem onClick={() => onNavigate('/admin')}>
                <ListItemIcon sx={{ minWidth: 'unset' }}>
                    <AdminPanelSettingsIcon />
                </ListItemIcon>
                Admin
            </MenuItem>
            <MenuItem onClick={onSignOut} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 'unset' }}>
                    <LogoutIcon color="error" />
                </ListItemIcon>
                Log off
            </MenuItem>
        </Menu>
    );
}