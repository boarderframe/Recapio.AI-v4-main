# Recapio State Management Architecture

This document outlines the state management architecture used in the Recapio application.

## Overview

The state management system is built using three main technologies:
- **Redux Toolkit** for global application state
- **Zustand** for local UI state
- **TanStack React Query** for server state management

## Directory Structure

```
src/state/
├── store.ts              # Redux store configuration
├── slices/               # Redux slices
│   ├── authSlice.ts     # Authentication state
│   ├── settingsSlice.ts # Application settings
│   └── notificationsSlice.ts # Global notifications
├── stores/              # Zustand stores
│   └── uiStore.ts      # UI-specific state
└── hooks/              # React Query hooks
    ├── useTranscripts.ts # Transcript data management
    └── useSummary.ts    # Summary generation and management
```

## State Management Strategy

### Global State (Redux)
- **Authentication**: User session, tenant information
- **Settings**: Theme, language, user preferences
- **Notifications**: Global application notifications

### Local State (Zustand)
- **UI State**: Sidebar state, modal visibility
- **View Preferences**: Selected items, view modes
- **Ephemeral Data**: Temporary form data

### Server State (React Query)
- **Data Fetching**: Transcript and summary data
- **Mutations**: Create, update, delete operations
- **Caching**: Automatic cache management

## Usage Examples

### Redux State

```typescript
// Using authentication state
import { useAppSelector, useAppDispatch } from '@/state/store';
import { loginUser } from '@/state/slices/authSlice';

const Component = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };
};
```

### Zustand State

```typescript
import { useUIStore } from '@/state/stores/uiStore';

const Component = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
      Toggle Sidebar
    </button>
  );
};
```

### React Query

```typescript
import { useTranscripts, useCreateTranscript } from '@/state/hooks/useTranscripts';

const Component = () => {
  const { data: transcripts, isLoading } = useTranscripts();
  const createTranscript = useCreateTranscript();

  const handleCreate = async (newTranscript) => {
    await createTranscript.mutateAsync(newTranscript);
  };
};
```

## Best Practices

1. **State Location**:
   - Use Redux for global, shared state
   - Use Zustand for component-specific state
   - Use React Query for server data

2. **Performance**:
   - Implement proper memoization
   - Use selective state subscriptions
   - Leverage React Query's caching

3. **Error Handling**:
   - Implement proper error boundaries
   - Use the notifications system for user feedback
   - Handle loading states appropriately

4. **Type Safety**:
   - Maintain proper TypeScript types
   - Use type inference where possible
   - Document complex type structures

## Middleware and Plugins

- **Redux**: Sentry integration for error tracking
- **Zustand**: Persistence plugin for specific stores
- **React Query**: Default configurations for caching and retries

## Testing

Test files are located alongside their respective implementation files:

```
src/state/
├── slices/
│   ├── authSlice.test.ts
│   ├── settingsSlice.test.ts
│   └── notificationsSlice.test.ts
└── hooks/
    ├── useTranscripts.test.ts
    └── useSummary.test.ts
```

Use Jest and React Testing Library for testing state management code. 