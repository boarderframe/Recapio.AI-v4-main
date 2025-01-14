import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User Operations
export async function getUserByEmail(email: string) {
    const { data, error } = await supabase
        .rpc('get_user_by_email', { p_email: email });
    
    if (error) throw error;
    return data;
}

export async function updateUserRoles(userId: string, roles: string[]) {
    const { data, error } = await supabase
        .rpc('update_user_roles', { 
            p_user_id: userId,
            p_roles: roles
        });
    
    if (error) throw error;
    return data;
}

// Transcript Operations
export async function createTranscript(
    tenantId: string,
    title: string,
    content?: string | null,
    metadata?: Record<string, any>
) {
    const { data, error } = await supabase
        .rpc('create_transcript', {
            p_tenant_id: tenantId,
            p_title: title,
            p_content: content,
            p_metadata: metadata
        });
    
    if (error) throw error;
    return data;
}

export async function getUserTranscripts(
    tenantId: string,
    limit = 10,
    offset = 0
) {
    const { data, error } = await supabase
        .rpc('get_user_transcripts', {
            p_tenant_id: tenantId,
            p_limit: limit,
            p_offset: offset
        });
    
    if (error) throw error;
    return data;
}

export async function updateTranscriptStatus(
    transcriptId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed'
) {
    const { data, error } = await supabase
        .rpc('update_transcript_status', {
            p_transcript_id: transcriptId,
            p_status: status
        });
    
    if (error) throw error;
    return data;
}

// Transcript Type Operations
export async function createTranscriptType(
    tenantId: string,
    name: string,
    description?: string | null,
    settings?: Record<string, any>
) {
    const { data, error } = await supabase
        .rpc('create_transcript_type', {
            p_tenant_id: tenantId,
            p_name: name,
            p_description: description,
            p_settings: settings
        });
    
    if (error) throw error;
    return data;
}

export async function getAvailableTranscriptTypes(tenantId: string) {
    const { data, error } = await supabase
        .rpc('get_available_transcript_types', {
            p_tenant_id: tenantId
        });
    
    if (error) throw error;
    return data;
}

// Utility Operations
export async function isAdmin(userId: string) {
    const { data, error } = await supabase
        .rpc('is_admin', { p_user_id: userId });
    
    if (error) throw error;
    return data;
}

export async function softDeleteTranscript(transcriptId: string) {
    const { data, error } = await supabase
        .rpc('soft_delete_transcript', {
            p_transcript_id: transcriptId
        });
    
    if (error) throw error;
    return data;
}

export async function softDeleteTranscriptType(typeId: number) {
    const { data, error } = await supabase
        .rpc('soft_delete_transcript_type', {
            p_type_id: typeId
        });
    
    if (error) throw error;
    return data;
}

// Raw Query Operations (for complex queries)
export async function executeRawQuery<T = any>(
    query: string,
    values?: any[]
) {
    const { data, error } = await supabase
        .rpc('execute_raw_query', {
            query,
            values: values || []
        });
    
    if (error) throw error;
    return data as T;
} 