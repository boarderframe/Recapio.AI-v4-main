# Layout System

## PageLayout Component
The unified `PageLayout` component serves as the foundation for all pages in the application.

### Usage
```tsx
import { PageLayout } from '@/components/layout/PageLayout';

export default function MyPage() {
  return (
    <PageLayout
      title="My Page"
      subtitle="Optional subtitle"
      toolbar={<MyToolbar />}
      layout="marketing" // 'marketing' | 'auth' | 'dashboard' | 'user' | 'admin'
      footer={{
        show: true,      // Control footer visibility
        sticky: false,   // Make footer sticky
        content: <CustomFooter /> // Optional custom footer content
      }}
    >
      {/* Page content */}
    </PageLayout>
  );
}
```

### Props
```typescript
interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  toolbar?: ReactNode;
  layout?: 'marketing' | 'auth' | 'dashboard' | 'user' | 'admin';
  footer?: {
    show?: boolean;
    sticky?: boolean;
    content?: ReactNode;
  };
  className?: string;
}
```

### Layout Types
1. **Marketing Layout** (Default)
   - Wide content area
   - Navigation header
   - Full footer integration
   - Optional sticky footer
   - `maxWidth: '1440px'`

2. **Admin Layout**
   - Full-width design
   - Left sidebar navigation
   - Action toolbar support
   - Minimal footer
   - `maxWidth: '100%'`

3. **Dashboard Layout**
   - Similar to admin layout
   - Full-width design
   - Data-focused components
   - `maxWidth: '100%'`

4. **Auth Layout**
   - Centered card layout
   - No navigation
   - No footer by default
   - Clean background
   - `maxWidth: '480px'`

5. **User Layout**
   - Similar to dashboard
   - Personalized content area
   - `maxWidth: '100%'`

## Component Structure
```
components/layout/PageLayout/
├── index.tsx           # Main exports
├── PageLayout.tsx      # Core layout component
├── PageHeader.tsx      # Header component
├── PageFooter.tsx      # Footer component
└── types.ts           # TypeScript interfaces
```

## Footer System
The PageLayout includes a built-in footer management system that integrates with the layout configuration:

### Default Footer Behavior
```tsx
// Default footer (based on layout type)
<PageLayout layout="marketing">
  {/* Content */}
</PageLayout>

// Hide footer
<PageLayout 
  layout="marketing"
  footer={{ show: false }}
>
  {/* Content */}
</PageLayout>

// Sticky footer
<PageLayout 
  layout="marketing"
  footer={{ sticky: true }}
>
  {/* Content */}
</PageLayout>

// Custom footer content
<PageLayout 
  layout="marketing"
  footer={{
    content: <CustomFooter />
  }}
>
  {/* Content */}
</PageLayout>
```

### Footer Configuration by Layout Type
- **Marketing**: Full footer enabled, not sticky by default
- **Admin**: Minimal footer, not sticky
- **Dashboard**: Footer disabled by default
- **Auth**: No footer
- **User**: Footer enabled, not sticky

## Implementation Details
- Built with TypeScript for type safety
- Uses Material-UI components
- Integrates with route-based layout configuration
- Supports responsive design patterns
- Flexible container sizing
- Automatic layout type handling

## Best Practices
1. Always use PageLayout as the base for all pages
2. Use the appropriate layout type for your page context
3. Keep footer content minimal and relevant
4. Maintain responsive behavior
5. Follow accessibility guidelines
6. Use proper TypeScript types

## Testing
- Component snapshot tests
- Layout behavior tests
- Responsive design tests
- Integration tests with templates
- Footer behavior tests
- Accessibility tests 