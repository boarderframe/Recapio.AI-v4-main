'use client';

import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Users</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    placeholder="Search users..."
                    size="small"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                />
                <Button variant="contained" color="primary">
                    Add User
                </Button>
            </Box>

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
        </Box>
    );
} 