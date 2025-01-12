# Recapio.ai Routing Implementation Plan

## 1. Route Structure Overview

### Public Routes (Marketing/Pre-login)
- `/` - Landing page with hero section and features
- `/pricing` - Pricing plans and comparison
- `/features` - Detailed feature showcase
- `/about` - About the company/product
- `/blog` - Blog posts and resources
- `/contact` - Contact form

### Authentication Routes
- `/login` - User login
- `/signup` - New user registration
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset
- `/verify-email` - Email verification

### Protected Routes (Post-login)
- `/dashboard` - Main user dashboard
- `/transcripts` - List of all transcripts
- `/transcripts/[id]` - Individual transcript view/edit
- `/transcripts/new` - Create new transcript
- `/settings` - User settings and preferences
- `/profile` - User profile management
- `/billing` - Subscription and billing management

## 2. Route Group Organization

```typescript
app/
├── (marketing)/ # Public marketing pages
│   ├── page.tsx # Landing
│   ├── pricing/
│   ├── features/
│   ├── about/
│   ├── blog/
│   └── contact/
├── (auth)/ # Authentication pages
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   └── verify-email/
└── (dashboard)/ # Protected app pages
    ├── dashboard/
    ├── transcripts/
    ├── settings/
    ├── profile/
    └── billing/
```

## 3. Implementation Steps

1. **Route Protection Setup**
   - Create middleware.ts for route protection
   - Implement public/protected route logic
   - Handle authentication state redirects

2. **Layout Structure**
   - Root layout with providers
   - Marketing layout for public pages
   - Dashboard layout for authenticated pages
   - Auth layout for login/signup flows

3. **Navigation Components**
   - Public navigation bar
   - Authenticated navigation bar
   - Mobile-responsive navigation
   - Breadcrumb navigation for dashboard

4. **Route Handlers**
   - API route handlers for data fetching
   - Authentication flow handlers
   - Error boundaries for each route group

## 4. Authentication Flow

1. **Pre-login State**
   - Unauthenticated users can only access marketing routes
   - Redirect to login for protected routes
   - Maintain intended destination for post-login redirect

2. **Login Process**
   - Handle login submission
   - Update auth context
   - Redirect to dashboard or intended destination
   - Show appropriate loading/error states

3. **Post-login State**
   - Maintain session across protected routes
   - Handle session expiry
   - Manage logout process

## 5. Implementation Priority

1. Set up route protection middleware
2. Implement layout structure
3. Create navigation components
4. Set up authentication flows
5. Implement protected routes
6. Add marketing pages
7. Implement error handling

## 6. Best Practices

1. **Performance**
   - Use dynamic imports for large components
   - Implement proper loading states
   - Optimize for route transitions

2. **Security**
   - Validate authentication on both client and server
   - Implement CSRF protection
   - Secure API routes

3. **User Experience**
   - Maintain loading states during transitions
   - Implement proper error handling
   - Add progress indicators
   - Ensure smooth navigation

4. **SEO & Accessibility**
   - Implement proper meta tags
   - Ensure semantic HTML
   - Add proper aria labels
   - Maintain proper heading hierarchy

## 7. Next Steps

1. Create middleware.ts for route protection
2. Set up route groups and layouts
3. Implement navigation components
4. Update authentication flow
5. Add protected routes
6. Implement error boundaries
7. Add loading states

Let's begin with implementing the middleware for route protection and setting up the basic layout structure. 