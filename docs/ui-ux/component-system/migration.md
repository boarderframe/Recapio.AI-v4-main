# Migration Guide: Component System v4

This guide helps you migrate from the previous component implementations to the new unified system.

## PageLayout Migration

### Before (Multiple Implementations)
```tsx
// Old implementation 1 (components/PageLayout.js)
import PageLayout from '@/components/PageLayout';
import PageFooter from '@/components/PageFooter';

export default function MyPage() {
  return (
    <PageLayout>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4">Title</Typography>
        {/* Content */}
      </Box>
      <PageFooter sticky>
        <FooterContent />
      </PageFooter>
    </PageLayout>
  );
}

// Old implementation 2 (components/AdminLayout.js)
import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout title="Admin">
      {/* Content */}
    </AdminLayout>
  );
}

// Old implementation 3 (components/MarketingLayout.js)
import MarketingLayout from '@/components/MarketingLayout';

export default function LandingPage() {
  return (
    <MarketingLayout showFooter>
      {/* Content */}
    </MarketingLayout>
  );
}
```

### After (Unified Implementation)
```tsx
// New implementation using unified PageLayout
import { PageLayout } from '@/components/layout/PageLayout';

// Marketing page
export function LandingPage() {
  return (
    <PageLayout
      title="Welcome"
      layout="marketing"
      footer={{
        show: true,
        content: <MarketingFooter />
      }}
    >
      {/* Content */}
    </PageLayout>
  );
}

// Admin page
export function AdminPage() {
  return (
    <PageLayout
      title="Admin Dashboard"
      layout="admin"
      toolbar={<AdminToolbar />}
    >
      {/* Content */}
    </PageLayout>
  );
}

// Auth page
export function LoginPage() {
  return (
    <PageLayout
      title="Login"
      layout="auth"
      footer={{ show: false }}
    >
      {/* Content */}
    </PageLayout>
  );
}
```

## Migration Steps

1. **Update Imports**
   ```typescript
   // Remove old imports
   - import PageLayout from '@/components/PageLayout';
   - import PageFooter from '@/components/PageFooter';
   - import AdminLayout from '@/components/AdminLayout';
   - import MarketingLayout from '@/components/MarketingLayout';
   
   // Add new unified import
   + import { PageLayout } from '@/components/layout/PageLayout';
   ```

2. **Update Layout Configuration**
   - Identify the correct layout type for each page:
     - Marketing pages: `layout="marketing"`
     - Admin pages: `layout="admin"`
     - Dashboard pages: `layout="dashboard"`
     - User pages: `layout="user"`
     - Auth pages: `layout="auth"`

3. **Migrate Page Headers**
   ```typescript
   // Before
   <Typography variant="h4">Title</Typography>
   
   // After
   <PageLayout title="Title" subtitle="Optional subtitle">
   ```

4. **Footer Migration**
   ```typescript
   // Before
   <PageFooter sticky>
     <FooterContent />
   </PageFooter>
   
   // After
   <PageLayout
     footer={{
       sticky: true,
       content: <FooterContent />
     }}
   >
   ```

5. **Toolbar Integration**
   ```typescript
   // Before
   <Box sx={{ mb: 2 }}>
     <AdminToolbar />
   </Box>
   
   // After
   <PageLayout
     toolbar={<AdminToolbar />}
   >
   ```

## Layout-Specific Migrations

### Marketing Pages
```typescript
// Before
<MarketingLayout>
  <MarketingHeader />
  {children}
  <MarketingFooter />
</MarketingLayout>

// After
<PageLayout
  layout="marketing"
  title="Page Title"
  footer={{
    content: <MarketingFooter />
  }}
>
  {children}
</PageLayout>
```

### Admin Pages
```typescript
// Before
<AdminLayout
  title="Admin"
  toolbar={<AdminToolbar />}
>
  {children}
</AdminLayout>

// After
<PageLayout
  layout="admin"
  title="Admin"
  toolbar={<AdminToolbar />}
>
  {children}
</PageLayout>
```

### Auth Pages
```typescript
// Before
<AuthLayout>
  <AuthHeader />
  {children}
</AuthLayout>

// After
<PageLayout
  layout="auth"
  title="Authentication"
  footer={{ show: false }}
>
  {children}
</PageLayout>
```

## Common Issues and Solutions

### 1. Layout Type Errors
```typescript
// Error: Invalid layout type
layout="default" // ❌

// Solution: Use correct layout type
layout="marketing" // ✅
```

### 2. Footer Configuration
```typescript
// Error: Incorrect footer prop
footer={<FooterContent />} // ❌

// Solution: Use footer config object
footer={{ content: <FooterContent /> }} // ✅
```

### 3. Container Width
```typescript
// Error: Manual container width
<Box maxWidth="1200px"> // ❌

// Solution: Use layout's built-in container
<PageLayout layout="marketing"> // ✅
```

## Migration Timeline

1. **Phase 1**: Core Layout Migration (Current)
   - Update imports
   - Replace basic layouts
   - Fix immediate issues

2. **Phase 2**: Footer Integration
   - Migrate footer components
   - Update footer configurations
   - Test footer behavior

3. **Phase 3**: Toolbar and Header Migration
   - Integrate page headers
   - Move toolbar components
   - Update navigation

4. **Phase 4**: Testing and Validation
   - Run component tests
   - Verify responsive behavior
   - Check accessibility

5. **Phase 5**: Cleanup
   - Remove old components
   - Update documentation
   - Final testing

## Support
- Review component documentation in `docs/ui-ux/component-system/`
- Check example implementations in `docs/ui-ux/examples/`
- Submit issues for migration-specific bugs
- Request clarification in the #ui-migration Slack channel 