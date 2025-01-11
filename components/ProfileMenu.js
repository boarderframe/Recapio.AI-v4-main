"use client";

import { Menu, MenuItem, ListItemIcon, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function ProfileMenu({ anchorEl, open, onClose, user, onSignOut, onNavigate }) {
    const displayName = user?.user_metadata?.display_name || 
        (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');

    const firstName = displayName.split(' ')[0];
    const isAdmin = user?.role === 'admin';

    return (
        <Menu
            anchorEl={anchorEl}
            id="profile-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    mt: 1,
                    minWidth: 200,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                    '& .MuiMenuItem-root': {
                        px: 1.5,
                        py: 0.75,
                        fontSize: '14px',
                        minHeight: '32px',
                        gap: '12px'
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '20px'
                    },
                    '& .MuiList-root': {
                        py: 0.75
                    }
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.primary',
                }}>
                    Welcome, {firstName}
                </Typography>
                {isAdmin && (
                    <Typography sx={{ 
                        fontSize: '12px',
                        color: 'text.secondary',
                        mt: 0.5
                    }}>
                        Administrator
                    </Typography>
                )}
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
            
            {isAdmin && (
                <MenuItem onClick={() => onNavigate('/admin')}>
                    <ListItemIcon sx={{ minWidth: 'unset' }}>
                        <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    Admin Console
                </MenuItem>
            )}
            
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 0.75 }}>
                <MenuItem onClick={onSignOut} sx={{ color: 'error.main', mt: 0.75 }}>
                    <ListItemIcon sx={{ minWidth: 'unset' }}>
                        <LogoutIcon color="error" />
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Box>
        </Menu>
    );
}