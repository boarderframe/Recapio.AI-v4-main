# Environment Configuration Guide

## Overview

This guide details all environment variables and configuration settings required for different deployment environments in Recapio.

## Environment Variables

### Core Configuration

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development    # development, staging, production
NEXT_PUBLIC_DEBUG_MODE=true        # Enable detailed logging

# API Keys
OPENAI_API_KEY=sk-...              # OpenAI API key
GOOGLE_API_KEY=AIza...             # Google Cloud API key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # For admin operations
```

### Optional Configuration

```env
# Feature Flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
NEXT_PUBLIC_MAINTENANCE_MODE=false

# Performance Monitoring
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX-Y
SENTRY_DSN=https://...

# External Services
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

## Environment-Specific Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=true
```

### Staging (.env.staging)
```env
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=true
```

### Production (.env.production)
```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

## Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-storage-domain.com'],
  },
  env: {
    customKey: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      },
    },
  },
  plugins: [],
}
```

## Security Considerations

### Environment Variable Security
1. Never commit `.env` files
2. Use different keys for different environments
3. Rotate keys regularly
4. Limit key permissions to required scope

### API Key Management
1. Store keys in environment variables
2. Use key rotation system
3. Implement rate limiting
4. Monitor usage patterns

## Deployment Configuration

### Vercel
```json
{
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_ENV": "production"
    }
  }
}
```

### Docker
```dockerfile
# Use build args for environment variables
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL

# Set environment variables
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
```

## Configuration Management

### Version Control
- Keep template `.env.example`
- Document all variables
- Track configuration changes

### Validation
```typescript
// config/validate.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
];

export function validateConfig() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
```

## Troubleshooting

### Common Issues
1. Missing environment variables
2. Invalid API keys
3. Wrong environment settings
4. Configuration conflicts

### Debug Mode
```typescript
if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
  console.log('Current configuration:', {
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    environment: process.env.NEXT_PUBLIC_APP_ENV,
  });
}
```

## Best Practices

1. **Security**
   - Use environment variables for sensitive data
   - Implement proper access controls
   - Regular security audits

2. **Maintenance**
   - Document all configuration changes
   - Regular configuration reviews
   - Automated validation

3. **Development**
   - Use type-safe configuration
   - Implement feature flags
   - Maintain configuration history 