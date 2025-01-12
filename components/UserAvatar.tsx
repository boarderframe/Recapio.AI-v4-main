import React from 'react';
import { Avatar, Box, useTheme } from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserAvatarProps {
    email?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    size?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function UserAvatar({ email, displayName, avatarUrl, size = 36, onClick }: UserAvatarProps) {
    const theme = useTheme();
    const text = displayName || email || '';
    const initials = text ? getInitials(text) : '';

    return (
        <Box
            onClick={onClick}
            sx={{
                width: size,
                height: size,
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Avatar
                src={avatarUrl || undefined}
                sx={{
                    width: size,
                    height: size,
                    fontSize: `${size * 0.4}px`,
                    fontWeight: 600,
                    background: avatarUrl ? undefined : `linear-gradient(135deg, 
                        ${theme.palette.primary.main} 0%,
                        ${theme.palette.primary.light} 50%,
                        ${theme.palette.primary.main} 100%
                    )`,
                    backgroundSize: '200% 200%',
                    animation: avatarUrl ? undefined : 'gradientShift 3s ease infinite',
                    color: 'white',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: `
                        0 0 0 2px ${theme.palette.background.paper},
                        0 0 0 4px ${theme.palette.primary.main}20,
                        0 2px 8px ${theme.palette.primary.main}20
                    `,
                    '&:hover': onClick ? {
                        transform: 'translateY(-1px)',
                        boxShadow: `
                            0 0 0 2px ${theme.palette.background.paper},
                            0 0 0 4px ${theme.palette.primary.main}30,
                            0 4px 12px ${theme.palette.primary.main}30
                        `,
                    } : undefined,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiSvgIcon-root': {
                        fontSize: `${size * 0.6}px`,
                        color: 'white',
                    },
                    '@keyframes gradientShift': {
                        '0%': {
                            backgroundPosition: '0% 50%'
                        },
                        '50%': {
                            backgroundPosition: '100% 50%'
                        },
                        '100%': {
                            backgroundPosition: '0% 50%'
                        }
                    }
                }}
            >
                {avatarUrl ? null : initials || <Person />}
            </Avatar>
        </Box>
    );
} 