# Recapio Navigation System Documentation

## Overview
This document details the complete navigation system implementation for Recapio, including both pre-login and post-login navigation bars, their configurations, component hierarchy, and styling details.

## File Structure
```
├── components/
│   ├── AuthNavbar.tsx        # Post-login navigation bar
│   ├── PublicNavbar.tsx      # Pre-login navigation bar
│   ├── Logo.tsx              # Logo component used in both navbars
│   └── PageLayout/
│       ├── PageHeader.tsx    # Page header component
│       ├── PageBody.tsx      # Page body wrapper
│       └── PageFooter.tsx    # Page footer component
├── lib/
│   ├── AuthContext.tsx       # Authentication context and user management
│   └── ThemeContext.tsx      # Theme settings and management
└── types/
    └── navigation.ts         # Type definitions for routes and navigation
```

## Component Hierarchy
```
AppBar
└── Box (Container)
    └── Toolbar
        ├── Logo
        ├── Navigation Items
        └── Profile Menu (AuthNavbar only)
```

## Dependencies
```json
{
  "@mui/material": "^5.x.x",
  "@mui/icons-material": "^5.x.x",
  "next": "^14.x.x",
  "react": "^18.x.x"
}
```

## Type Definitions (types/navigation.ts)
```typescript
export interface Route {
  path: string;
  label: string;
  requiresAuth?: boolean;
}

export interface AuthNavbarProps {
  mainRoutes: Route[];
  userMenuRoutes: Route[];
}

export interface PublicNavbarProps {
  mainRoutes: Route[];
}
```

## AuthNavbar Implementation (components/AuthNavbar.tsx)
```typescript
${currentFile}
```

## Key Features

### 1. Container Layout
- Maximum width: 1200px
- Centered with auto margins
- Responsive padding: xs: 16px, sm: 24px, md: 32px

### 2. Navigation Items
- Centered between logo and profile
- Gap between items: 32px (theme.spacing(4))
- Hover effect with underline animation
- Responsive hiding on mobile

### 3. Profile Menu
- Gradient background on icon
- Smooth hover transitions
- Dropdown with user info and actions
- Separate styling for logout action

### 4. Responsive Behavior
- Desktop: Full navigation with all items visible
- Mobile: Hamburger menu (to be implemented)
- Breakpoint: md (960px)

## Styling Guidelines

### Colors
- Background: theme.palette.background.paper
- Text: theme.palette.text.primary
- Hover: theme.palette.action.hover
- Profile Icon: Linear gradient of primary colors

### Spacing
- Navbar height: 64px
- Menu item padding: px: 2, py: 0.8
- Profile menu padding: px: 2.5, py: 1.5

### Shadows
- Navbar: 0 1px 2px rgba(0, 0, 0, 0.1)
- Profile Menu: 0px 4px 20px rgba(0, 0, 0, 0.08)

## Implementation Notes

### 1. Page Content Alignment
- All page content should align with the navbar container
- Use PageLayout components for consistent spacing
- Match maxWidth and padding values

### 2. Theme Integration
- Uses MUI theme for consistent styling
- Supports light/dark mode through theme context
- Custom gradient effects for profile icon

### 3. Authentication Integration
- Integrated with AuthContext for user management
- Handles login/logout flows
- Displays user information in profile menu

### 4. Route Management
- Routes defined at app level and passed as props
- Supports both public and authenticated routes
- Handles navigation through Next.js router

## Common Issues and Solutions

1. **Menu Item Alignment**
   - Use flex: 1 for center section
   - Add appropriate margins (mx: 4)
   - Avoid fixed widths for dynamic content

2. **Profile Icon Positioning**
   - Use flexShrink: 0 to prevent compression
   - Maintain consistent height with parent
   - Apply proper spacing for dropdown alignment

3. **Responsive Layout**
   - Use MUI's display helpers for breakpoints
   - Maintain proper spacing on all screen sizes
   - Consider mobile-first approach

## Maintenance Guidelines

1. **Adding New Routes**
   - Update route types if adding new properties
   - Consider authentication requirements
   - Maintain consistent naming conventions

2. **Styling Updates**
   - Use theme values for consistency
   - Maintain responsive behavior
   - Test on all breakpoints

3. **Component Updates**
   - Maintain prop type definitions
   - Update documentation for new features
   - Test with different user states

## Testing Checklist

1. **Layout**
   - [ ] Navbar aligns with page content
   - [ ] Menu items are properly centered
   - [ ] Profile menu opens without overflow

2. **Functionality**
   - [ ] All routes work correctly
   - [ ] Profile menu actions function
   - [ ] Authentication state handled properly

3. **Responsiveness**
   - [ ] Displays correctly on all breakpoints
   - [ ] No overflow issues
   - [ ] Touch targets are appropriate size

## Security Considerations

1. **Route Protection**
   - Implement requiresAuth checking
   - Validate user permissions
   - Handle unauthorized access

2. **User Data**
   - Sanitize displayed user information
   - Handle missing user data gracefully
   - Protect sensitive information

## Performance Optimization

1. **Component Rendering**
   - Use memo for static components
   - Optimize state updates
   - Minimize re-renders

2. **Asset Loading**
   - Optimize logo and icon loading
   - Consider lazy loading for mobile menu
   - Use appropriate image formats

## Future Improvements

1. **Accessibility**
   - Add ARIA labels
   - Improve keyboard navigation
   - Enhance screen reader support

2. **Features**
   - Add search functionality
   - Implement notifications
   - Add breadcrumb navigation

3. **Mobile Experience**
   - Enhance touch interactions
   - Add gesture support
   - Improve mobile menu animations 