import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/state/store';

interface GenerateSummaryParams {
  transcriptId: string;
  content: string;
  format: 'stream' | 'cards' | 'summary';
}

interface Summary {
  id: string;
  transcript_id: string;
  content: string;
  format: 'stream' | 'cards' | 'summary';
  created_at: string;
  tenant_id: string;
  user_id: string;
}

export const useGenerateSummary = () => {
  const queryClient = useQueryClient();
  const tenantId = useAppSelector((state) => state.auth.tenantId);
  const userId = useAppSelector((state) => state.auth.user?.id);

  return useMutation({
    mutationFn: async ({ transcriptId, content, format }: GenerateSummaryParams) => {
      // First, call your AI service to generate the summary
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryContent = await response.json();

      // Then, save the summary to the database
      const { data, error } = await supabase.from('summaries').insert([
        {
          transcript_id: transcriptId,
          content: summaryContent,
          format,
          tenant_id: tenantId,
          user_id: userId,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['transcript', variables.transcriptId] });
      queryClient.invalidateQueries({ queryKey: ['summary', variables.transcriptId] });
    },
  });
};

export const useSummary = (transcriptId: string | undefined) => {
  const tenantId = useAppSelector((state) => state.auth.tenantId);

  return useQuery({
    queryKey: ['summary', transcriptId],
    queryFn: async () => {
      if (!transcriptId) throw new Error('Transcript ID is required');

      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('transcript_id', transcriptId)
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data as Summary;
    },
    enabled: !!transcriptId,
  });
}; 