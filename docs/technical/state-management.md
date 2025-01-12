# State Management System

The Recapio application uses a hybrid state management approach, combining Redux Toolkit for global application state, Zustand for UI state, and React Query for server state management. This document outlines the structure and usage of each state management solution.

## Table of Contents
- [Overview](#overview)
- [Redux Store](#redux-store)
- [Zustand Stores](#zustand-stores)
- [React Query](#react-query)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

The state management system is divided into three main parts:

1. **Redux Store**: Handles global application state (auth, settings)
2. **Zustand Stores**: Manages UI-related state (theme, menus, modals)
3. **React Query**: Handles server state and API interactions

## Redux Store

### Store Configuration
The Redux store is configured in `lib/state/config.ts` and includes the following slices:

- **Auth Slice**: Manages user authentication state
- **Settings Slice**: Handles application settings
- **UI Slice**: Controls UI-related state

### Usage Example
```typescript
import { useAppDispatch, useAppSelector } from 'lib/state';

// In a component
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);

// Dispatching actions
dispatch(setUser(userData));
```

## Zustand Stores

### Available Stores

1. **UI Store**
   - Manages sidebar state
   - Controls menu visibility
   - Handles modal states

2. **Theme Store**
   - Manages theme mode (light/dark)
   - Persists theme preferences

3. **Settings Store**
   - Handles user preferences
   - Manages feature toggles

### Usage Example
```typescript
import { useUIStore, useThemeStore } from 'lib/state';

// In a component
const { isSidebarOpen, toggleSidebar } = useUIStore();
const { mode, toggleMode } = useThemeStore();
```

## React Query

### API Configuration
The API is configured using RTK Query in `lib/state/api.ts` and includes endpoints for:

- User management
- Transcript operations
- AI model interactions

### Usage Example
```typescript
import { useGetUserQuery, useUpdateUserMutation } from 'lib/state';

// In a component
const { data: user, isLoading } = useGetUserQuery(userId);
const [updateUser] = useUpdateUserMutation();
```

## Best Practices

1. **State Management Selection**
   - Use Redux for global application state
   - Use Zustand for UI state
   - Use React Query for server state

2. **Performance Considerations**
   - Avoid storing server data in Redux
   - Use selective state updates
   - Implement proper memoization

3. **Type Safety**
   - Use TypeScript for type safety
   - Define proper interfaces
   - Utilize type inference

## Examples

### Complete Component Example
```typescript
import { useAppSelector, useUIStore, useGetTranscriptsQuery } from 'lib/state';

const TranscriptList = () => {
    // Redux state
    const user = useAppSelector((state) => state.auth.user);
    
    // Zustand state
    const { isCompactView } = useUIStore();
    
    // Server state
    const { data: transcripts, isLoading } = useGetTranscriptsQuery();
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div className={isCompactView ? 'compact' : 'full'}>
            {transcripts?.map((transcript) => (
                <TranscriptItem 
                    key={transcript.id} 
                    transcript={transcript}
                    isOwner={transcript.userId === user?.id}
                />
            ))}
        </div>
    );
};
```

### State Updates Example
```typescript
// Redux action
dispatch(setThemeMode('dark'));

// Zustand action
useUIStore.getState().toggleSidebar();

// React Query mutation
const [updateTranscript] = useUpdateTranscriptMutation();
await updateTranscript({ id: '123', title: 'Updated Title' });
```

## File Structure
```
lib/state/
├── config.ts           # Store configuration
├── index.ts           # Barrel file
├── api.ts             # API configuration
└── slices/
    ├── authSlice.ts   # Authentication slice
    ├── settingsSlice.ts # Settings slice
    └── uiSlice.ts     # UI slice
``` 