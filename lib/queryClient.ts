import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});

// Error handling configuration
queryClient.setQueryDefaults(['*'], {
    onError: (error: any) => {
        console.error('Query error:', error);
        // You can add global error handling here
    },
});

queryClient.setMutationDefaults(['*'], {
    onError: (error: any) => {
        console.error('Mutation error:', error);
        // You can add global error handling here
    },
});

// Add global cache listeners
queryClient.getQueryCache().subscribe(event => {
    // Log cache events in development
    if (process.env.NODE_ENV === 'development') {
        console.debug('Query Cache event:', event);
    }
});

// Add mutation cache listeners
queryClient.getMutationCache().subscribe(event => {
    // Log mutation events in development
    if (process.env.NODE_ENV === 'development') {
        console.debug('Mutation Cache event:', event);
    }
});

// Custom error handler
export const handleQueryError = (error: any) => {
    if (error.response?.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
    } else if (error.response?.status === 403) {
        // Handle forbidden access
        console.error('Access forbidden');
    } else {
        // Handle other errors
        console.error('Query error:', error);
    }
};

// Utility function to invalidate related queries
export const invalidateRelatedQueries = async (
    queryKey: string | string[],
    options = {}
) => {
    const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
    await Promise.all(
        keys.map(key => queryClient.invalidateQueries({ queryKey: [key], ...options }))
    );
}; 