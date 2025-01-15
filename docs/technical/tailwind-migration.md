# Tailwind CSS Migration Plan

## Current Status (Updated)

### Completed Tasks
1. ✅ Removed MUI dependencies
   - Uninstalled `@mui/material`, `@mui/icons-material`, `@mui/lab`, `@mui/x-data-grid`
   - Removed `@emotion/react` and `@emotion/styled`
2. ✅ Set up Tailwind CSS configuration
   - Added base configuration
   - Configured dark mode
   - Set up container defaults

### In Progress
1. 🔄 Theme configuration
   - Custom color scheme implementation
   - Dark mode variants
   - Component-specific styles
2. 🔄 Component migration
   - Navigation components
   - Layout structures
   - Form elements

### Pending Tasks
1. ⏳ Custom utility classes
2. ⏳ Component-specific dark mode
3. ⏳ Animation utilities
4. ⏳ Responsive design patterns

## Theme Configuration

### Colors
```javascript
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
}
```

### Border Radius
```javascript
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

### Container
```javascript
container: {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
}
```

## Component Migration Guide

### Navigation Components
- Replace MUI AppBar with custom Tailwind header
- Convert Drawer to Headless UI Dialog
- Use Heroicons instead of MUI icons
- Implement mobile menu with Headless UI

### Form Elements
- Replace TextField with styled input elements
- Convert Select to Headless UI Listbox
- Migrate Button styles to Tailwind classes
- Implement custom form validation styles

### Layout Components
- Convert Paper to styled div elements
- Replace Grid with Tailwind grid classes
- Implement responsive containers
- Use flex utilities for alignment

## Utility Functions

### Class Name Merging
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## CSS Base Layer
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Next Steps
1. Complete theme configuration
2. Implement remaining component migrations
3. Add custom animations
4. Enhance responsive design
5. Document component usage patterns

## Success Criteria
1. ✅ No MUI dependencies
2. ✅ Consistent theme system
3. 🔄 Responsive components
4. ⏳ Dark mode support
5. ⏳ Performance optimization
6. ⏳ Documentation coverage 