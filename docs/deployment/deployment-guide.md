# Deployment Guide

## Overview

This guide covers the deployment process for Recapio, including different deployment environments, configuration, and best practices.

## Deployment Environments

### Development
- Local development server
- Development database
- Debug mode enabled
- Beta features enabled

### Staging
- Production-like environment
- Test database
- Limited access
- Beta features for testing

### Production
- Live environment
- Production database
- Optimized performance
- Stable features only

## Deployment Platforms

### Vercel Deployment

1. **Setup**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Configuration**
   Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next"
       }
     ],
     "env": {
       "NEXT_PUBLIC_APP_URL": "@app_url",
       "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
     }
   }
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod

   # Deploy to preview
   vercel
   ```

### Docker Deployment

1. **Dockerfile**
   ```dockerfile
   # Base image
   FROM node:18-alpine

   # Set working directory
   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci

   # Copy source
   COPY . .

   # Build application
   RUN npm run build

   # Start application
   CMD ["npm", "start"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     web:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_APP_URL=http://localhost:3000
         - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
   ```

3. **Build and Run**
   ```bash
   # Build image
   docker build -t recapio .

   # Run container
   docker run -p 3000:3000 recapio
   ```

## Database Deployment

### Supabase Setup

1. **Migrations**
   ```bash
   # Generate migration
   npx supabase migration new your_migration_name

   # Apply migrations
   npx supabase db push
   ```

2. **Backup Strategy**
   ```bash
   # Backup database
   npx supabase db dump -f backup.sql

   # Restore database
   npx supabase db restore backup.sql
   ```

### Data Seeding
```bash
# Run seed script
npx supabase db seed

# Verify seeding
npx supabase db reset
```

## SSL Configuration

### Certificate Setup
1. Obtain SSL certificate
2. Configure in deployment platform
3. Enable HTTPS redirects

### Security Headers
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      },
    ]
  },
}
```

## Monitoring and Logging

### Setup Monitoring
1. Configure Sentry
2. Set up logging
3. Enable performance monitoring

### Health Checks
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}
```

## Deployment Checklist

### Pre-deployment
- [ ] Run tests
- [ ] Build locally
- [ ] Check environment variables
- [ ] Review security settings
- [ ] Backup database

### Deployment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Check logs
- [ ] Monitor performance
- [ ] Deploy to production

### Post-deployment
- [ ] Verify functionality
- [ ] Check analytics
- [ ] Monitor errors
- [ ] Update documentation

## Rollback Procedures

### Code Rollback
```bash
# Revert to previous version
git revert HEAD

# Deploy previous version
vercel --prod
```

### Database Rollback
```bash
# Revert migration
npx supabase db reset --version previous_version
```

## Performance Optimization

### Build Optimization
1. Analyze bundle size
2. Optimize images
3. Enable compression

### Caching Strategy
1. Configure CDN
2. Implement caching headers
3. Use static generation

## Maintenance Procedures

### Regular Tasks
1. Update dependencies
2. Rotate API keys
3. Review logs
4. Update documentation

### Emergency Procedures
1. System shutdown process
2. Data recovery steps
3. Communication plan

## Support and Monitoring

### Monitoring Tools
- Sentry for error tracking
- Vercel Analytics
- Custom logging

### Support Procedures
1. Issue tracking
2. Response times
3. Escalation process

## Contributing to Deployment

When updating deployment:
1. Document changes
2. Test thoroughly
3. Update this guide
4. Train team members 