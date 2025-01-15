# Development Guide

## Git Workflow and Branch Strategy

### Core Branch Structure
```
main              # Production-ready code
├── core/base     # Base stable version
│   ├── core/auth # Authentication system
│   ├── core/ui   # UI components and navigation
│   ├── core/api  # API and business logic
│   └── core/db   # Database and data models
└── develop       # Integration branch
```

### Version Tagging
- `v4.4.0-base` - Base stable version
- `v4.4.0-auth` - Authentication system
- `v4.4.0-ui` - UI and navigation
- `v4.4.0-api` - API layer
- `v4.4.0-db` - Database schema

### Working with Features

1. **Starting New Feature**
```bash
# Example for UI feature
git checkout core/ui
git checkout -b feature/mobile-nav

# Example for auth feature
git checkout core/auth
git checkout -b feature/email-verification
```

2. **Completing Feature**
```bash
# After testing feature
git checkout core/ui
git merge feature/mobile-nav
git tag v4.4.1-ui  # New stable UI version
```

3. **Integration Process**
```bash
# Test integration
git checkout develop
git merge core/auth   # Get latest auth
git merge core/ui    # Get latest UI
git merge core/db    # Get latest DB

# Release
git checkout main
git merge develop
git tag v4.5.0
```

### Recovery Process
If a feature breaks, you can always return to the last stable version:
```bash
# UI breaks
git checkout v4.4.0-ui
git checkout -b fix/ui-issue

# Auth breaks
git checkout v4.4.0-auth
git checkout -b fix/auth-issue
```

### Best Practices

1. **Never Commit Directly to Core Branches**
   - Always create feature branches
   - Use descriptive branch names
   - Delete feature branches after merging

2. **Version Tagging**
   - Tag stable versions of core features
   - Use semantic versioning
   - Include feature scope in tag name

3. **Commit Messages**
```bash
# Format:
type(scope): subject

# Types:
feat: New feature
fix: Bug fix
docs: Documentation
style: Code style
refactor: Code refactoring
test: Testing
chore: Maintenance

# Examples:
git commit -m "feat(auth): add email verification"
git commit -m "fix(ui): correct mobile menu alignment"
```

4. **Branch Naming**
```
feature/   # New features
fix/       # Bug fixes
docs/      # Documentation
refactor/  # Code improvements
test/      # Testing additions

Examples:
feature/user-profiles
fix/auth-redirect
docs/api-documentation
```

## Development Process

### 1. Starting New Work
1. Choose appropriate core branch
2. Create feature branch
3. Make changes and commit regularly
4. Test thoroughly

### 2. Completing Work
1. Merge feature to core branch
2. Tag new stable version
3. Delete feature branch
4. Update documentation

### 3. Integration
1. Merge to develop
2. Test all features together
3. Fix any integration issues
4. Merge to main when stable

## Active Work
- Finishing Tailwind migration (removing MUI)
- Building out admin console
- Improving role system
- Optimizing database queries

## Quick Status
🔥 **Priority**: Complete Tailwind migration
- Found MUI still in use across many components
- Need to remove MUI packages and convert remaining components
- Will affect auth, navigation, and admin sections

🏗️ **In Progress**
- Admin console dashboard
- Role management
- Dark mode support

📋 **Up Next**
- User management interface
- Activity logging
- Performance monitoring

## Notes & Decisions
- Moving from MUI to Tailwind (Jan 2024)
  - Keep detailed migration notes in `/plans/active/tailwind-completion-2024-01.md`
  - Most layout/nav components done
  - Still need to convert auth/forms/modals

- Admin Interface (Jan 2024)
  - Basic structure working
  - Need to flesh out dashboard
  - Role system partially implemented

## Reference
Key docs in `/plans/reference/`:
- [Development Strategy](/plans/reference/development-strategy.md)
- [Local Development](/plans/reference/local-development-strategy.md)

## Weekly Checklist
- [ ] Run dependency checks (`npm audit`, `npm outdated`)
- [ ] Review and clean up any legacy code
- [ ] Update documentation for changes
- [ ] Check for security updates 