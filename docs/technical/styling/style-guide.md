# Recapio.AI Styling Guide

This document outlines the styling and theming conventions used in the Recapio.AI application.

## Table of Contents
- [Theme Configuration](#theme-configuration)
- [Layout Components](#layout-components)
- [Global Styles](#global-styles)
- [Utility Hooks](#utility-hooks)
- [Design System](#design-system)

## Theme Configuration

Our theme is configured in `src/theme/theme.ts` and extends the default Material-UI theme with our custom palette, typography, and component overrides:

```typescript
// Example theme configuration
{
  palette: {
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1E40AF',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    // ... other typography variants
  },
  shape: {
    borderRadius: 8,
  },
}
```

## Layout Components

### PageLayout
The `PageLayout` component provides consistent page structure and spacing:

```typescript
// Example PageLayout structure
<Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
  <Header />
  <Box component="main" sx={{ marginTop: 3 }}>
    {children}
  </Box>
</Box>
```

### ContentCard
Used for containing page content with consistent styling:

```typescript
// Example ContentCard usage
<Paper
  elevation={0}
  sx={{
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    padding: { xs: 2, sm: 3 },
  }}
>
  {children}
</Paper>
```

### Dropdown and Icon Alignment

**Description**: Use a flexbox layout to ensure consistent alignment and sizing of dropdowns and icons.

**Usage**:
- Align items using `display: 'flex'` and `alignItems: 'center'`.
- Set consistent `height` for all elements to ensure uniformity.
- Use `gap` to control spacing between elements.

**Example**:

```jsx
<Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', height: 56 }}>
    <FormControl fullWidth variant="outlined" sx={{ height: '100%' }}>
        <InputLabel shrink={true} sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.87)', '&.Mui-focused': { color: 'rgba(0, 0, 0, 0.87)' } }}>
            Label
        </InputLabel>
        <Select value={value} onChange={handleChange} label="Label" notched sx={{ height: '100%' }}>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
    <IconButton onClick={handleClick} sx={{ color: 'text.secondary', height: 40, width: 40 }}>
        <Icon />
    </IconButton>
</Box>
```

**Notes**:
- Ensure all dropdowns and icons have the same height for visual consistency.
- Adjust `gap` to modify spacing between elements.
- Use `alignItems: 'center'` to vertically center elements within the flex container.

## Global Styles

Global styles are defined in `src/styles/globals.css`:

```css
:root {
  --max-width: 1440px;
  --border-radius: 8px;
  --font-mono: ui-monospace, monospace;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  background-color: var(--background-default);
  color: var(--text-primary);
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
}
```

## Utility Hooks

### useResponsive
Custom hook for responsive design:

```typescript
const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  return { isMobile, isTablet, isDesktop };
};
```

## Design System

### Spacing
We follow an 8-point grid system:
- `theme.spacing(1)` = 8px
- `theme.spacing(2)` = 16px
- `theme.spacing(3)` = 24px
- `theme.spacing(4)` = 32px

### Component Guidelines

#### Cards and Containers
- Use `Paper` component with `elevation={0}` and border
- Consistent border radius using `theme.shape.borderRadius`
- Padding: 16px (mobile), 24px (tablet/desktop)

#### Typography
- Headers: Use MUI Typography with appropriate variants
- Body text: Use `body1` for primary content, `body2` for secondary
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

#### Buttons and Interactive Elements
- Primary actions: Filled buttons
- Secondary actions: Outlined buttons
- Tertiary actions: Text buttons
- Icons: 24px for primary, 20px for secondary

#### Forms and Inputs
- Use small variant for dense UIs
- Consistent helper text styling
- Error states using theme error colors

### Best Practices

1. **Responsive Design**
   - Use MUI's responsive breakpoints
   - Implement mobile-first approach
   - Test layouts across all breakpoints

2. **Accessibility**
   - Maintain color contrast ratios
   - Include proper ARIA labels
   - Support keyboard navigation

3. **Performance**
   - Use system fonts when possible
   - Optimize images and icons
   - Implement lazy loading for heavy components

4. **Consistency**
   - Follow established component patterns
   - Use theme tokens instead of hard-coded values
   - Maintain consistent spacing and alignment

## Contributing

When adding new styles or components:
1. Follow the existing patterns and conventions
2. Use theme variables instead of hard-coded values
3. Document any new patterns or components
4. Test across different screen sizes
5. Ensure accessibility compliance 