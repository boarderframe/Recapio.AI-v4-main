# Recapio.AI Component System

## Overview
This document outlines the unified component system for Recapio.AI v4, focusing on maintainability, consistency, and developer experience. The system provides a standardized approach to page layouts, components, and development tools.

## Key Features
- Unified layout system with distinct types (marketing, auth, app, admin)
- Standardized templates and components
- Development indicators for layout identification
- Consistent header and footer management
- Responsive design patterns
- Component testing integration

## Directory Structure
```
components/
├── layout/           # Layout components
│   ├── PageLayout/  # Main page layout system
│   │   ├── PageLayout.tsx    # Core layout component
│   │   ├── PageHeader.tsx    # Header component
│   │   ├── PageFooter.tsx    # Footer component
│   │   ├── LayoutIndicator.tsx # Development indicator
│   │   └── types.ts         # Layout type definitions
│   └── templates/   # Page templates
├── common/          # Shared components
│   ├── ContentCard/  # Content wrapper component
│   └── ...          # Other shared components
└── admin/           # Admin-specific components
```

## Layout Types
The system supports four main layout types:

1. **Marketing Layout** (`layout="marketing"`)
   - Used for: Home, About, Features, Contact, Pricing
   - Features: Full-width header, marketing footer, CTAs

2. **Auth Layout** (`layout="auth"`)
   - Used for: Login, Signup
   - Features: Centered content, minimal header, optional footer

3. **App Layout** (`layout="app"`)
   - Used for: Dashboard, Transcripts, Profile, Settings
   - Features: App header with actions, consistent navigation

4. **Admin Layout** (`layout="admin"`)
   - Used for: User Management, Profit, Billing
   - Features: Admin toolbar, specialized navigation

## Getting Started
1. Import the PageLayout component:
   ```tsx
   import { PageLayout } from '@/components/layout/PageLayout';
   import ContentCard from '@/components/ContentCard';
   ```

2. Choose the appropriate layout type:
   ```tsx
   <PageLayout
     title="Page Title"
     subtitle="Optional subtitle"
     layout="app" // Choose: marketing, auth, app, admin
     toolbar={optionalToolbar}
   >
     <ContentCard>
       {/* Page content */}
     </ContentCard>
   </PageLayout>
   ```

3. Follow the migration guide for existing pages
4. Implement testing for new components

## Development Tools

### Layout Indicator
During development, each page displays a chip in the bottom-right corner indicating the current layout type:
- 🟦 Marketing (Blue)
- 🟨 Auth (Yellow)
- 🟩 App (Green)
- 🟥 Admin (Red)

This helps developers quickly identify which layout is being used while building and debugging pages.

## Documentation Structure
- [Layouts](./layouts.md) - Detailed layout system documentation
- [Templates](./templates.md) - Template system and patterns
- [Migration](./migration.md) - Step-by-step migration guide
- [Examples](../examples/) - Implementation examples

## Development Guidelines
1. Use TypeScript for all new components
2. Follow the component testing guidelines
3. Document new patterns or components
4. Update snapshots when making changes
5. Use the layout indicator during development
6. Maintain consistent styling within layout types

## Quality Control
- Component testing required
- Accessibility compliance (WCAG 2.1)
- Responsive design verification
- Performance benchmarking
- Layout consistency checks
- Cross-browser testing

## Support
For assistance with the component system:
1. Review the documentation in this directory
2. Check example implementations
3. Submit issues with `[UI]` tag
4. Request code reviews for new patterns 