# Authentication System Troubleshooting Plan

## Latest Updates (v4.3.1)
1. Fixed auth listener cleanup issues
2. Improved session storage handling
3. Added better state management for UI changes
4. Enhanced error handling and recovery

## Common Issues and Solutions

### 1. Auth Listener Issues
- **Symptom**: `authListener.unsubscribe is not a function`
- **Solution**: 
  ```typescript
  // Correct way to handle auth subscription
  let authSubscription: { unsubscribe: () => void } | null = null;
  authSubscription = supabase.auth.onAuthStateChange(...).data.subscription;
  ```
- **Prevention**: Always store and cleanup subscription properly

### 2. UI State Management
- **Symptom**: App crashes during UI changes
- **Solution**:
  - Add mounted state check
  - Prevent state updates on unmounted components
  - Use proper cleanup in useEffect
  ```typescript
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  ```

### 3. Session Management
- **Symptom**: Session lost on page refresh
- **Solution**:
  - Use sessionStorage instead of localStorage
  - Proper rehydration of auth store
  ```typescript
  {
    storage: createJSONStorage(() => sessionStorage),
    onRehydrateStorage: () => (state) => {
      if (state) {
        setTimeout(() => {
          const store = useAuthStore.getState();
          store.initialize();
        }, 0);
      }
    }
  }
  ```

## Current Issues Identified
1. 400 (Bad Request) error when attempting to get a token
2. Local Supabase instance configuration may be incorrect
3. Password hashing method in local setup may not match Supabase's expectations
4. Environment variables might be pointing to production instead of local instance

## System Components Analysis

### 1. Database Layer Issues
- Password hashing in `create_admin_user.sql` uses `pgcrypto` with custom salt
- Supabase local instance might expect a different hashing method
- User exists in both tables but auth fails

### 2. Authentication Service Issues
- `supabaseClient.ts` configuration looks correct but environment variables need verification
- PKCE flow is enabled which is good for security
- Debug mode is enabled in development which will help troubleshooting

### 3. Environment Configuration
- Need to verify local Supabase URL and anon key
- Check if we're accidentally using production credentials
- Verify local instance is running and accessible

## Action Plan

### Phase 1: Environment Setup (Priority)
1. Verify local Supabase is running:
   ```bash
   supabase status
   ```

2. Get correct local credentials:
   ```bash
   supabase start
   supabase status
   ```

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[key from supabase status]
   ```

### Phase 2: Database Reset
1. Drop existing user:
   ```sql
   DELETE FROM auth.users WHERE email = 'cosburn@yahoo.com';
   DELETE FROM public.users WHERE email = 'cosburn@yahoo.com';
   ```

2. Create user using Supabase's auth API:
   ```bash
   curl -X POST 'http://localhost:54321/auth/v1/admin/users' \
     -H "apikey: [service_role_key]" \
     -H "Authorization: Bearer [service_role_key]" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "cosburn@yahoo.com",
       "password": "changeme123",
       "email_confirm": true,
       "user_metadata": {
         "first_name": "Carl",
         "last_name": "Osburn"
       },
       "app_metadata": {
         "provider": "email",
         "providers": ["email"]
       }
     }'
   ```

### Phase 3: Verification
1. Check user in auth.users:
   ```sql
   SELECT id, email, encrypted_password, email_confirmed_at, raw_app_meta_data
   FROM auth.users WHERE email = 'cosburn@yahoo.com';
   ```

2. Check user in public.users:
   ```sql
   SELECT id, email, roles FROM public.users WHERE email = 'cosburn@yahoo.com';
   ```

3. Verify environment variables in Next.js:
   ```javascript
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   ```

### Phase 4: Testing
1. Clear browser storage:
   - Local Storage
   - Session Storage
   - Cookies

2. Restart Next.js development server:
   ```bash
   npm run dev
   ```

3. Test login with:
   - Email: cosburn@yahoo.com
   - Password: changeme123

## Success Criteria
1. No 400 errors in browser console
2. Successful token generation
3. User session persisted in sessionStorage
4. Protected routes accessible
5. User metadata available in AuthContext
6. UI remains stable during modifications

## Debugging Tips
1. Watch Network tab in DevTools for token request
2. Check browser console for Supabase debug logs
3. Verify sessionStorage for session data
4. Monitor server logs for auth errors
5. Check component mounted state before updates
6. Verify proper cleanup of subscriptions

## Notes
- All commands assume local Supabase instance
- Service role key should never be exposed in frontend code
- Keep debug mode enabled until issues are resolved
- Document any deviations from this plan
- Always check component mount status before state updates
- Use proper TypeScript types for auth state 