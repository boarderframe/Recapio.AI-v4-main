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
Located in the bottom-right corner, the indicator consists of three interactive chips:

1. Version Chip (Blue)
   - Shows current version number
   - Clickable to show detailed system information
   - Includes dependencies and system details
   - Color-coded for visibility

2. Layout Chip (Color varies by type)
   - Shows current layout type
   - Hover for detailed layout information
   - Color coding:
     - Marketing: Blue (Primary)
     - Auth: Purple (Secondary)
     - App: Green (Success)
     - Admin: Red (Error)

3. Environment Chip
   - Shows current environment
   - Hover for environment details
   - Color coding:
     - Production: Green
     - Development: Orange
     - Staging: Blue

### Detailed Information Display

#### Version Details
- Base Version
- Environment
- Build Number (non-production)
- Build Time
- Dependencies:
  - Node.js version
  - Next.js version
  - React version
  - MUI version
- System Information:
  - Platform
  - Architecture
  - Memory
  - CPU cores

#### Layout Information
Each layout type includes:
- Description
- Feature list
- Routing pattern
- Authentication requirements
- Special configurations

#### Environment Details
Environment-specific information includes:
- Environment type
- Build number
- Build time
- Environment features
- Active configurations
- Monitoring status
- Available tools

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

## Build Number Management

### Development Environment
- Increments automatically on server restart
- Maintains counter in memory
- Resets on full server restart

### Production/Staging
- Set via environment variable
- Managed by deployment process
- Tracked in deployment logs

## Best Practices

### Version Updates
1. Update version in package.json
2. Follow semantic versioning (4.x.x)
3. Set appropriate environment variables
4. Update build time on deployment

### Environment Handling
1. Set appropriate environment variables
2. Validate version format
3. Handle invalid versions gracefully
4. Log version information on startup

### Layout Management
1. Use appropriate layout types
2. Follow routing conventions
3. Implement required security measures
4. Maintain layout documentation

## Future Enhancements
1. Automated build number management in CI/CD
2. Version history tracking
3. Environment-specific styling
4. Extended system information
5. Performance metrics integration
6. Deployment tracking integration 