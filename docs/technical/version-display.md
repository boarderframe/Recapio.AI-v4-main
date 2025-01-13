# Version Display System

## Overview
The version display system provides real-time visibility of application version, environment, and build information across the application. This helps developers and testers quickly identify the exact version and environment they're working with.

## Implementation

### Version Management (`lib/version.ts`)
```typescript
// Base version from package.json (v4.x.x format)
export const BASE_VERSION = validateVersion(pkg.version);

// Environment-specific suffixes
const VERSION_SUFFIXES = {
    production: '',
    staging: '-rc',
    development: '-dev',
    training: '-train'
};

// Version string format examples:
// Production: v4.1.0
// Staging: v4.1.0-rc.1
// Development: v4.1.0-dev.1
// Training: v4.1.0-train.1
```

### Version Display Components

#### Layout Indicator
- Located in bottom-right corner (development only)
- Shows version, layout type, and environment
- Clickable version chip reveals detailed information
- Styled for visibility without interference

#### Detailed Version Information
- Base Version
- Environment
- Build Number (non-production)
- Build Time
- Dependencies (Next.js, React, MUI)
- System Information (Node.js, Platform, Architecture)

### Environment Configuration
Required environment variables:
```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_BUILD_NUMBER=1
NEXT_PUBLIC_BUILD_TIME=2024-03-19T00:00:00.000Z
```

## Version Format

### Production
- Format: v4.1.0
- No environment suffix
- No build number

### Non-Production Environments
- Development: v4.1.0-dev.1
- Staging: v4.1.0-rc.1
- Training: v4.1.0-train.1
- Includes build number

## Best Practices

### Version Updates
1. Update version in package.json
2. Follow semantic versioning (4.x.x)
3. Increment build number for deployments
4. Update build time on deployment

### Environment Handling
1. Set appropriate environment variables
2. Validate version format
3. Handle invalid versions gracefully
4. Log version information on startup

## Future Enhancements
1. Automated build number increments
2. Version history tracking
3. Environment-specific styling
4. Extended system information
5. Performance metrics integration 