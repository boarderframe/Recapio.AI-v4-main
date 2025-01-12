# Recapio Authentication System Documentation

## Overview
This document details the complete authentication system implementation for Recapio, including user management, session handling, protected routes, and integration with Supabase Auth.

## File Structure
```
├── lib/
│   ├── AuthContext.tsx           # Main authentication context and provider
│   ├── supabase.ts              # Supabase client configuration
│   └── middleware.ts            # Authentication middleware
├── components/
│   ├── AuthGuard.tsx           # Protected route wrapper
│   └── forms/
│       ├── LoginForm.tsx       # Login form component
│       ├── SignupForm.tsx      # Registration form component
│       └── ResetPasswordForm.tsx # Password reset form
├── types/
│   └── auth.ts                 # Authentication type definitions
└── pages/
    ├── login.tsx               # Login page
    ├── signup.tsx              # Registration page
    └── reset-password.tsx      # Password reset page
```

## Dependencies
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "@supabase/auth-helpers-nextjs": "^0.8.x",
  "next": "^14.x.x",
  "react": "^18.x.x",
  "zod": "^3.x.x"  // For form validation
}
```

## Type Definitions (types/auth.ts)
```typescript
export interface User {
  id: string;
  email: string;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
  };
  app_metadata: {
    role?: 'user' | 'admin';
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

## Authentication Context Implementation

### Key Features
1. **Session Management**
   - Automatic session refresh
   - Persistent login state
   - Secure token storage

2. **User Management**
   - User registration
   - Login/Logout
   - Password reset
   - Profile updates

3. **Role-based Access**
   - User/Admin role distinction
   - Protected route handling
   - Permission checking

### Implementation Details

#### 1. Supabase Client Configuration (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

#### 2. Authentication Middleware (middleware.ts)
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes logic
  const protectedPaths = ['/dashboard', '/settings', '/profile'];
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Auth page redirects for logged-in users
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.includes(req.nextUrl.pathname);

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}
```

## Security Implementation

### 1. Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

### 2. Rate Limiting
- Login attempts: 5 per minute
- Password reset requests: 3 per hour
- Account creation: 3 per hour per IP

### 3. Session Management
- Token refresh every 1 hour
- Session expiry after 7 days
- Secure cookie storage
- CSRF protection

## Error Handling

### 1. Authentication Errors
```typescript
const handleAuthError = (error: AuthError) => {
  switch (error.status) {
    case 400:
      return 'Invalid credentials';
    case 422:
      return 'Email already exists';
    case 429:
      return 'Too many attempts';
    default:
      return 'An error occurred';
  }
};
```

### 2. Form Validation
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

## Protected Routes Implementation

### 1. AuthGuard Component
```typescript
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : null;
};
```

### 2. Admin Route Protection
```typescript
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const isAdmin = user?.app_metadata?.role === 'admin';

  if (!isAdmin) {
    return <UnauthorizedScreen />;
  }

  return <>{children}</>;
};
```

## State Management

### 1. Loading States
- Initial authentication check
- Login/Signup process
- Password reset
- Profile updates

### 2. Error States
- Form validation errors
- Authentication errors
- Network errors
- Session errors

## Testing Guidelines

### 1. Unit Tests
- Authentication functions
- Form validation
- Error handling
- Guard components

### 2. Integration Tests
- Login flow
- Registration flow
- Password reset flow
- Protected routes

### 3. E2E Tests
- Complete user journey
- Session persistence
- Route protection
- Error scenarios

## Performance Considerations

### 1. Authentication State
- Minimize re-renders
- Efficient context updates
- Proper loading states

### 2. Form Handling
- Debounced validation
- Optimistic updates
- Progressive enhancement

## Maintenance Guidelines

### 1. Security Updates
- Regular dependency updates
- Security patch application
- Token rotation strategy

### 2. Code Updates
- Maintain type definitions
- Update error messages
- Document changes
- Test coverage

## Troubleshooting Guide

### 1. Common Issues
- Session persistence problems
- Token refresh failures
- Route protection issues
- Form validation errors

### 2. Solutions
- Clear browser storage
- Check token expiration
- Verify route configuration
- Validate form data

## Future Improvements

### 1. Authentication Methods
- Social login integration
- Two-factor authentication
- Biometric authentication
- SSO integration

### 2. Security Enhancements
- Advanced rate limiting
- Fraud detection
- Security event logging
- IP blocking

### 3. User Experience
- Remember me functionality
- Auto-logout warnings
- Session activity tracking
- Multiple sessions management 