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
      layout="default" // or "admin", "marketing", etc.
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
- `title`: Page title (required)
- `subtitle`: Optional subtitle
- `toolbar`: Optional toolbar component
- `layout`: Layout type from layout config
- `footer`: Footer configuration object
  - `show`: Control footer visibility
  - `sticky`: Make footer stick to bottom
  - `content`: Custom footer content
- `children`: Page content

### Layout Types
1. **Default Layout**
   - Standard page layout
   - Centered content
   - Responsive padding
   - Standard footer

2. **Admin Layout**
   - Full-width design
   - Left sidebar navigation
   - Action toolbar support
   - Minimal footer

3. **Marketing Layout**
   - Wide content area
   - Navigation header
   - Full footer integration
   - Optional sticky footer

4. **Auth Layout**
   - Centered card layout
   - No navigation
   - No footer by default
   - Clean background

## Footer System
The PageLayout includes a built-in footer management system:

### Default Footer Behavior
```tsx
// Default footer (automatically included)
<PageLayout layout="default">
  {/* Content */}
</PageLayout>

// Hide footer
<PageLayout 
  layout="default"
  footer={{ show: false }}
>
  {/* Content */}
</PageLayout>

// Sticky footer
<PageLayout 
  layout="default"
  footer={{ sticky: true }}
>
  {/* Content */}
</PageLayout>

// Custom footer content
<PageLayout 
  layout="default"
  footer={{
    content: <CustomFooter />
  }}
>
  {/* Content */}
</PageLayout>
```

### Footer Configuration by Layout Type
- **Default**: Standard footer, not sticky
- **Marketing**: Full-width footer with navigation
- **Admin**: Minimal footer with version info
- **Auth**: No footer by default

## Template System
Templates extend the base PageLayout with specific configurations:

### Available Templates
1. `DashboardTemplate`
2. `ListingTemplate`
3. `DetailTemplate`
4. `SettingsTemplate`

### Example
```tsx
import { DashboardTemplate } from '@/components/layout/templates';

export default function Dashboard() {
  return (
    <DashboardTemplate
      title="Dashboard"
      metrics={<DashboardMetrics />}
    >
      {/* Dashboard content */}
    </DashboardTemplate>
  );
}
```

## Implementation Details
- Built with TypeScript
- Uses layout configuration system
- Integrates with theme settings
- Supports responsive breakpoints
- Flexible footer management

## Best Practices
1. Always use PageLayout as the base
2. Choose appropriate templates for consistency
3. Maintain responsive behavior
4. Follow accessibility guidelines
5. Use footer configuration based on layout type

## Testing
- Component snapshot tests
- Layout behavior tests
- Responsive design tests
- Integration tests with templates
- Footer behavior tests 