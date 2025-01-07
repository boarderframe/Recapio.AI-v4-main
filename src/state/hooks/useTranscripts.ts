import { useState, useEffect } from 'react';

export interface Transcript {
  id: string;
  title: string;
  type: string;
  created_at: string;
  favorite: boolean;
  collection_id?: string;
  hashtags?: string[];
  summary?: string;
}

// Temporary mock data
const mockTranscripts: Transcript[] = [
  {
    id: '1',
    title: 'Q4 Financial Report Analysis',
    type: 'report',
    created_at: new Date().toISOString(),
    favorite: true,
    hashtags: ['finance', 'quarterly'],
  },
  {
    id: '2',
    title: 'Product Team Weekly Sync',
    type: 'video',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    favorite: false,
    collection_id: 'team-meetings',
    hashtags: ['product', 'weekly-sync'],
  },
  {
    id: '3',
    title: 'Annual Strategy Presentation',
    type: 'meeting',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    favorite: false,
    hashtags: ['strategy', 'annual-review'],
  },
  {
    id: '4',
    title: 'Customer Feedback Session',
    type: 'audio',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    favorite: true,
    collection_id: 'customer-research',
    hashtags: ['feedback', 'research'],
  },
  {
    id: '5',
    title: 'Internal Process Documentation',
    type: 'document',
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    favorite: false,
    hashtags: ['process', 'documentation'],
  },
  {
    id: '6',
    title: 'Marketing Workshop Recording',
    type: 'workshop',
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    favorite: false,
    collection_id: 'marketing',
    hashtags: ['marketing', 'workshop'],
  },
];

export function useTranscripts() {
  const [data, setData] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockTranscripts);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transcripts'));
        setIsLoading(false);
      }
    };

    fetchTranscripts();
  }, []);

  const toggleFavorite = async (id: string) => {
    setData(prevData =>
      prevData.map(transcript =>
        transcript.id === id
          ? { ...transcript, favorite: !transcript.favorite }
          : transcript
      )
    );
  };

  return {
    data,
    isLoading,
    error,
    toggleFavorite,
  };
} 