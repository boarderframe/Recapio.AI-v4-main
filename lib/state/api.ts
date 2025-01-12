import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appConfig } from '../config';

// Define types for API responses
interface User {
    id: string;
    email: string;
    role: string;
    metadata?: Record<string, any>;
}

interface Transcript {
    id: string;
    userId: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface AIModel {
    id: string;
    modelName: string;
    providerId: string;
    tokenLimit: number;
    costPerToken: number;
    capabilities: string[];
    version: string;
    tenantId: string;
}

// Create the API slice
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: appConfig.SUPABASE_URL,
        prepareHeaders: (headers) => {
            headers.set('apikey', appConfig.SUPABASE_ANON_KEY);
            headers.set('Authorization', `Bearer ${appConfig.SUPABASE_ANON_KEY}`);
            return headers;
        },
    }),
    tagTypes: ['User', 'Transcript', 'AIModel'],
    endpoints: (builder) => ({
        // User endpoints
        getUser: builder.query<User, string>({
            query: (id) => `/rest/v1/users?id=eq.${id}&select=*`,
            providesTags: ['User'],
        }),
        updateUser: builder.mutation<void, Partial<User> & Pick<User, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `/rest/v1/users?id=eq.${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['User'],
        }),

        // Transcript endpoints
        getTranscripts: builder.query<Transcript[], void>({
            query: () => `/rest/v1/transcripts?select=*`,
            providesTags: ['Transcript'],
        }),
        getTranscriptById: builder.query<Transcript, string>({
            query: (id) => `/rest/v1/transcripts?id=eq.${id}&select=*`,
            providesTags: ['Transcript'],
        }),
        createTranscript: builder.mutation<void, Omit<Transcript, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (body) => ({
                url: `/rest/v1/transcripts`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Transcript'],
        }),
        updateTranscript: builder.mutation<void, Partial<Transcript> & Pick<Transcript, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `/rest/v1/transcripts?id=eq.${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Transcript'],
        }),
        deleteTranscript: builder.mutation<void, string>({
            query: (id) => ({
                url: `/rest/v1/transcripts?id=eq.${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Transcript'],
        }),

        // AI Model endpoints
        getAIModels: builder.query<AIModel[], void>({
            query: () => `/rest/v1/ai_models?select=*`,
            providesTags: ['AIModel'],
        }),
        getAIModelById: builder.query<AIModel, string>({
            query: (id) => `/rest/v1/ai_models?id=eq.${id}&select=*`,
            providesTags: ['AIModel'],
        }),
        createAIModel: builder.mutation<void, Omit<AIModel, 'id'>>({
            query: (body) => ({
                url: `/rest/v1/ai_models`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AIModel'],
        }),
        updateAIModel: builder.mutation<void, Partial<AIModel> & Pick<AIModel, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `/rest/v1/ai_models?id=eq.${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['AIModel'],
        }),
        deleteAIModel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/rest/v1/ai_models?id=eq.${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AIModel'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetUserQuery,
    useUpdateUserMutation,
    useGetTranscriptsQuery,
    useGetTranscriptByIdQuery,
    useCreateTranscriptMutation,
    useUpdateTranscriptMutation,
    useDeleteTranscriptMutation,
    useGetAIModelsQuery,
    useGetAIModelByIdQuery,
    useCreateAIModelMutation,
    useUpdateAIModelMutation,
    useDeleteAIModelMutation,
} = api; 