# Migration Guide: Component System v4

This guide helps you migrate from the previous component implementations to the new unified system.

## PageLayout Migration

### Before
```tsx
// Old implementation
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
      footer={{
        sticky: true,
        content: <FooterContent />
      }}
    >
      {/* Content */}
    </PageLayout>
  );
}
```

## Migration Steps

1. **Update Imports**
   - Replace old PageLayout imports
   - Remove separate PageFooter imports
   - Update path to new component structure
   - Remove unused imports

2. **Component Props**
   - Move title/subtitle to PageLayout props
   - Update layout configuration
   - Move footer configuration into PageLayout props
   - Remove redundant styling

3. **Footer Migration**
   - Remove standalone PageFooter components
   - Move footer content to PageLayout footer prop
   - Update footer configuration based on layout type
   - Migrate sticky footer behavior

4. **Template Migration**
   - Identify appropriate template
   - Replace custom implementations
   - Update component composition
   - Configure template-specific footer behavior

5. **Testing Updates**
   - Update snapshot tests
   - Add new test cases
   - Verify responsive behavior
   - Test footer configurations

## Common Patterns

### Admin Pages
```tsx
// Before
import AdminLayout from '@/components/AdminLayout';
import PageFooter from '@/components/PageFooter';

// After
import { AdminTemplate } from '@/components/layout/templates';
```

### Marketing Pages
```tsx
// Before
import MarketingLayout from '@/components/MarketingLayout';
import PageFooter from '@/components/PageFooter';

// After
import { MarketingTemplate } from '@/components/layout/templates';
```

### Footer Patterns
```tsx
// Before - Standalone footer
<PageFooter sticky>
  <FooterContent />
</PageFooter>

// After - Integrated footer
<PageLayout
  footer={{
    sticky: true,
    content: <FooterContent />
  }}
>
  {/* Content */}
</PageLayout>
```

## Troubleshooting

### Common Issues
1. Missing layout props
2. Template compatibility
3. Styling conflicts
4. Footer visibility issues
5. Sticky footer behavior

### Solutions
1. Check required props
2. Review template documentation
3. Remove conflicting styles
4. Verify footer configuration
5. Check layout container setup

## Timeline

1. **Phase 1**: Core layout migration
2. **Phase 2**: Footer integration
3. **Phase 3**: Template implementation
4. **Phase 4**: Testing and validation
5. **Phase 5**: Documentation updates

## Support
- Review component documentation
- Check example implementations
- Submit issues for bugs
- Request clarification if needed 