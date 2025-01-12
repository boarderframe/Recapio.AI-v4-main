import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export interface Transcript {
  id: string;
  title: string;
  content: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  status: 'processing' | 'completed' | 'failed';
  userId: string;
}

export function useTranscripts() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (!user) {
        setTranscripts([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/transcripts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transcripts');
        }

        const data = await response.json();
        setTranscripts(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscripts();
  }, [user]);

  const addTranscript = async (newTranscript: Omit<Transcript, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/transcripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(newTranscript)
      });

      if (!response.ok) {
        throw new Error('Failed to add transcript');
      }

      const data = await response.json();
      setTranscripts(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTranscript = async (id: string, updates: Partial<Transcript>) => {
    try {
      const response = await fetch(`/api/transcripts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update transcript');
      }

      const updatedTranscript = await response.json();
      setTranscripts(prev => 
        prev.map(t => t.id === id ? updatedTranscript : t)
      );
      return updatedTranscript;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTranscript = async (id: string) => {
    try {
      const response = await fetch(`/api/transcripts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete transcript');
      }

      setTranscripts(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    transcripts,
    isLoading,
    error,
    addTranscript,
    updateTranscript,
    deleteTranscript
  };
} 