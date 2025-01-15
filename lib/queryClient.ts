import { QueryClient, DefaultOptions, Query, Mutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const defaultOptions: DefaultOptions = {
    queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
    },
    mutations: {
        retry: 1,
    },
};

// Create a client
export const queryClient = new QueryClient({
    defaultOptions,
});

// Add error handlers
queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'updated' && event.query.state.error instanceof Error) {
        toast.error(`Query Error: ${event.query.state.error.message}`);
    }
});

queryClient.getMutationCache().subscribe(event => {
    if (event.type === 'updated' && event.mutation.state.error instanceof Error) {
        toast.error(`Mutation Error: ${event.mutation.state.error.message}`);
    }
});

// Custom error handler
export const handleQueryError = (error: unknown) => {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
    } else if (err.response?.status === 403) {
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
    options: Record<string, unknown> = {}
) => {
    const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
    await Promise.all(
        keys.map(key => queryClient.invalidateQueries({ queryKey: [key], ...options }))
    );
}; 