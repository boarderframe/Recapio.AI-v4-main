# Recapio Profile Menu System Documentation

## Overview
This document details the complete profile menu implementation for Recapio, including the profile icon, dropdown menu, and all associated styling and functionality.

## File Structure
```
├── components/
│   ├── AuthNavbar.tsx           # Contains profile menu implementation
│   └── icons/
│       └── AccountCircle.tsx    # Fallback icon component
├── lib/
│   └── AuthContext.tsx          # User authentication and profile data
└── types/
    └── auth.ts                  # Profile-related type definitions
```

## Component Implementation

### 1. Profile Icon Button
```typescript
<IconButton
    onClick={handleOpenUserMenu}
    sx={{
        width: 36,
        height: 36,
        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        fontSize: '1rem',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
        '&:hover': {
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        },
        transition: 'all 0.2s ease-in-out',
    }}
>
    {user?.email ? user.email[0].toUpperCase() : <AccountCircle />}
</IconButton>
```

### 2. Profile Menu Component
```typescript
<Menu
    sx={{ 
        mt: '45px',
        '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: 'divider',
        },
    }}
    id="menu-appbar"
    anchorEl={anchorElUser}
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    keepMounted
    transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    open={Boolean(anchorElUser)}
    onClose={handleCloseUserMenu}
>
    {/* Menu Content */}
</Menu>
```

## Key Features

### 1. Profile Icon Design
- Circular button with gradient background
- Dynamic content (user initial or fallback icon)
- Smooth hover effects
- Consistent 36x36px dimensions
- Elegant shadow effects

### 2. Menu Layout
```typescript
// User Info Section
<Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {user?.user_metadata?.display_name || user?.email}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
        {user?.email}
    </Typography>
</Box>

// Menu Items
{userMenuRoutes.map((route) => (
    <MenuItem 
        key={route.path}
        onClick={() => handleMenuItemClick(route)}
        sx={{
            py: 1.5,
            px: 2.5,
            '&:hover': {
                backgroundColor: 'action.hover',
            },
        }}
    >
        <Typography>{route.label}</Typography>
    </MenuItem>
))}

// Admin Console Item
<MenuItem 
    onClick={() => handleMenuItemClick({ 
        path: '/admin', 
        label: 'Admin Console',
        requiresAuth: true 
    })}
    sx={{
        py: 1.5,
        px: 2.5,
        '&:hover': {
            backgroundColor: 'action.hover',
        },
    }}
>
    <Typography>Admin Console</Typography>
</MenuItem>

// Logout Section
<Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1 }}>
    <MenuItem 
        onClick={() => signOut()}
        sx={{
            py: 1.5,
            px: 2.5,
            color: 'error.main',
            '&:hover': {
                backgroundColor: 'error.lighter',
            },
        }}
    >
        <Typography>Logout</Typography>
    </MenuItem>
</Box>
```

## Styling Details

### 1. Icon Button Styling
```typescript
const iconButtonStyles = {
    dimensions: {
        width: 36,
        height: 36
    },
    colors: {
        gradient: 'linear-gradient(45deg, primary.main, primary.dark)',
        text: 'white'
    },
    typography: {
        fontSize: '1rem',
        fontWeight: 600
    },
    effects: {
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
        hoverShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        transition: 'all 0.2s ease-in-out'
    }
};
```

### 2. Menu Styling
```typescript
const menuStyles = {
    offset: {
        marginTop: '45px'
    },
    container: {
        borderRadius: 2,
        minWidth: 200,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid',
        borderColor: 'divider'
    },
    items: {
        padding: {
            vertical: 1.5,
            horizontal: 2.5
        }
    }
};
```

## Interaction States

### 1. Icon States
- Default: Gradient background
- Hover: Reversed gradient, enhanced shadow
- Active: Pressed state with darker gradient

### 2. Menu Item States
- Default: Clean background
- Hover: Light background tint
- Active: Slightly darker background
- Logout: Red text, light red background on hover

## Animation Details

### 1. Icon Transitions
```typescript
const transitions = {
    icon: 'all 0.2s ease-in-out',
    shadow: 'box-shadow 0.2s ease-in-out',
    background: 'background 0.2s ease-in-out'
};
```

### 2. Menu Transitions
- Smooth fade in/out
- Natural easing functions
- 200ms duration for all animations

## Responsive Behavior

### 1. Icon Adaptations
- Maintains size across breakpoints
- Consistent positioning
- Clear touch target on mobile

### 2. Menu Adaptations
- Full width on mobile devices
- Adjusted padding for touch targets
- Maintained minimum width on desktop

## Integration Points

### 1. Authentication
- Uses AuthContext for user data
- Handles login state
- Manages user permissions

### 2. Navigation
- Integrates with Next.js router
- Handles route changes
- Manages menu state

## Error Handling

### 1. User Data
- Fallback to email if no display name
- AccountCircle icon if no user data
- Error boundaries for menu content

### 2. Navigation
- Protected route handling
- Invalid route fallbacks
- Loading states

## Performance Considerations

### 1. Rendering
- Memoized menu items
- Efficient state updates
- Optimized animations

### 2. State Management
- Local state for menu open/close
- Cached user data
- Minimal re-renders

## Accessibility

### 1. Keyboard Navigation
- Full keyboard support
- Focus management
- ARIA labels

### 2. Screen Readers
- Semantic HTML
- ARIA roles
- Meaningful labels

## Future Enhancements

### 1. Features
- User avatar support
- Role-based menu items
- Activity indicators

### 2. Styling
- Theme customization
- Animation preferences
- Mobile optimizations 