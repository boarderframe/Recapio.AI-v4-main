# Migration Guide: Component System v4

This guide helps you migrate from the previous component implementations to the new unified system.

## Layout Types

The unified system supports the following layout types:

- **Marketing Layout (`layout="marketing"`)**: Used for public-facing pages like landing, about, features, and pricing.
- **Auth Layout (`layout="auth"`)**: Used for authentication pages like login and signup.
- **App Layout (`layout="app"`)**: Used for post-login pages like dashboard, transcripts, profile, and settings.
- **Admin Layout (`layout="admin"`)**: Used for admin-specific pages like user management and billing.

Each layout type has specific configurations for headers, footers, and other UI elements.

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
import ContentCard from '@/components/ContentCard';

// Marketing page
export function LandingPage() {
  return (
    <PageLayout
      title="Welcome"
      subtitle="Experience the power of AI transcription"
      layout="marketing"
      footer={{
        show: true,
        content: <MarketingFooter />
      }}
    >
      <ContentCard>
        {/* Content */}
      </ContentCard>
    </PageLayout>
  );
}

// App page (post-login)
export function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome back!"
      layout="app"
      toolbar={<DashboardActions />}
    >
      <ContentCard>
        {/* Content */}
      </ContentCard>
    </PageLayout>
  );
}

// Admin page
export function AdminPage() {
  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Manage system settings"
      layout="admin"
      toolbar={<AdminToolbar />}
    >
      <ContentCard>
        {/* Content */}
      </ContentCard>
    </PageLayout>
  );
}

// Auth page
export function LoginPage() {
  return (
    <PageLayout
      title="Login"
      subtitle="Sign in to your account"
      layout="auth"
      toolbar={null}
    >
      <ContentCard>
        {/* Content */}
      </ContentCard>
    </PageLayout>
  );
}
```

## Migration Steps

1. **Update Imports**
   - Replace old layout imports with the unified PageLayout:
   ```tsx
   import { PageLayout } from '@/components/layout/PageLayout';
   import ContentCard from '@/components/ContentCard';
   ```

2. **Choose Layout Type**
   - Determine the appropriate layout type for your page:
     - Marketing pages: `layout="marketing"`
     - Auth pages: `layout="auth"`
     - Post-login pages: `layout="app"`
     - Admin pages: `layout="admin"`

3. **Configure Layout Props**
   - Add required props:
     - `title`: Page title
     - `subtitle`: Optional subtitle
     - `layout`: Layout type
     - `toolbar`: Optional toolbar component
     - `footer`: Optional footer configuration

4. **Wrap Content**
   - Wrap page content in `ContentCard` for consistent styling:
   ```tsx
   <ContentCard>
     {/* Your page content */}
   </ContentCard>
   ```

## Development Indicator

During development, each page displays a layout indicator chip in the bottom-right corner showing the current layout type. This helps identify which layout is being used while building and debugging pages.

## Common Patterns

### Marketing Pages
```tsx
<PageLayout
  title="Features"
  subtitle="Discover what Recapio.ai can do for you"
  layout="marketing"
>
  <ContentCard>
    <FeaturesContent />
  </ContentCard>
</PageLayout>
```

### Auth Pages
```tsx
<PageLayout
  title="Sign Up"
  subtitle="Create your Recapio.ai account"
  layout="auth"
  toolbar={null}
>
  <ContentCard>
    <SignUpForm />
  </ContentCard>
</PageLayout>
```

### App Pages
```tsx
<PageLayout
  title="Transcript Library"
  subtitle="View and manage your transcripts"
  layout="app"
  toolbar={<TranscriptActions />}
>
  <ContentCard>
    <TranscriptList />
  </ContentCard>
</PageLayout>
```

### Admin Pages
```tsx
<PageLayout
  title="User Management"
  subtitle="Manage system users and permissions"
  layout="admin"
  toolbar={<UserActions />}
>
  <ContentCard>
    <UserTable />
  </ContentCard>
</PageLayout>
```

## Timeline

1. Phase 1: Marketing Pages Migration ✅
   - Home, About, Features, Contact, Pricing

2. Phase 2: Auth Pages Migration ✅
   - Login, Signup

3. Phase 3: App Pages Migration ✅
   - Dashboard, Transcripts, Profile, Settings

4. Phase 4: Admin Pages Migration ✅
   - Users, Profit, Billing

## Support

For questions or issues during migration:
1. Review the component documentation in `/docs/ui-ux/component-system/`
2. Check the example implementations in `/docs/ui-ux/examples/`
3. Submit an issue with the tag `[UI-Migration]` 