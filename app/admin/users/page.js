'use client';

import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCard from '@/components/ContentCard';
import { PersonAdd } from '@mui/icons-material';

const UserRow = ({ user }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
            borderBottom: 'none'
        }
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
            }}>
                {user.name.charAt(0).toUpperCase()}
            </Box>
            <Box>
                <Typography variant="subtitle2">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.email}
                </Typography>
            </Box>
        </Box>
        <Box>
            <IconButton size="small" sx={{ mr: 1 }}>
                <EditIcon />
            </IconButton>
            <IconButton size="small" color="error">
                <DeleteIcon />
            </IconButton>
        </Box>
    </Box>
);

export default function UsersPage() {
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor' },
    ];

    return (
        <Box>
            <ContentCard>
                <Box sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                }}>
                    {mockUsers.map(user => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </Box>
            </ContentCard>
        </Box>
    );
} 