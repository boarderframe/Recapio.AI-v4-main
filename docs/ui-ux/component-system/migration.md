# Migration Guide: Component System v4

This guide helps you migrate from the previous component implementations to the new unified system.

## PageLayout Migration

### Before
```tsx
// Old implementation
import PageLayout from '@/components/PageLayout';

export default function MyPage() {
  return (
    <PageLayout>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4">Title</Typography>
        {/* Content */}
      </Box>
    </PageLayout>
  );
}
```

### After
```tsx
// New implementation
import { PageLayout } from '@/components/layout/PageLayout';

export default function MyPage() {
  return (
    <PageLayout
      title="Title"
      layout="default"
    >
      {/* Content */}
    </PageLayout>
  );
}
```

## Migration Steps

1. **Update Imports**
   - Replace old PageLayout imports
   - Update path to new component structure
   - Remove unused imports

2. **Component Props**
   - Move title/subtitle to PageLayout props
   - Update layout configuration
   - Remove redundant styling

3. **Template Migration**
   - Identify appropriate template
   - Replace custom implementations
   - Update component composition

4. **Testing Updates**
   - Update snapshot tests
   - Add new test cases
   - Verify responsive behavior

## Common Patterns

### Admin Pages
```tsx
// Before
import AdminLayout from '@/components/AdminLayout';

// After
import { AdminTemplate } from '@/components/layout/templates';
```

### Marketing Pages
```tsx
// Before
import MarketingLayout from '@/components/MarketingLayout';

// After
import { MarketingTemplate } from '@/components/layout/templates';
```

## Troubleshooting

### Common Issues
1. Missing layout props
2. Template compatibility
3. Styling conflicts

### Solutions
1. Check required props
2. Review template documentation
3. Remove conflicting styles

## Timeline

1. **Phase 1**: Core layout migration
2. **Phase 2**: Template implementation
3. **Phase 3**: Testing and validation
4. **Phase 4**: Documentation updates

## Support
- Review component documentation
- Check example implementations
- Submit issues for bugs
- Request clarification if needed 