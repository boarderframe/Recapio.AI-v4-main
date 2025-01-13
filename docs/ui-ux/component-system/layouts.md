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
- `children`: Page content

### Layout Types
1. **Default Layout**
   - Standard page layout
   - Centered content
   - Responsive padding

2. **Admin Layout**
   - Full-width design
   - Left sidebar navigation
   - Action toolbar support

3. **Marketing Layout**
   - Wide content area
   - Navigation header
   - Footer integration

4. **Auth Layout**
   - Centered card layout
   - No navigation
   - Clean background

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

## Best Practices
1. Always use PageLayout as the base
2. Choose appropriate templates for consistency
3. Maintain responsive behavior
4. Follow accessibility guidelines

## Testing
- Component snapshot tests
- Layout behavior tests
- Responsive design tests
- Integration tests with templates 