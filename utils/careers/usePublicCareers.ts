import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface PublicCareer {
  _id: string;
  role: string;
  experience: string;
  requirements: string[];
  description: string;
  location: string;
  mode: 'remote' | 'offline' | 'hybrid';
  applyUrl: string;
  salary?: string;
  department?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  skills?: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
}

export const usePublicCareers = () => {
  const [careers, setCareers] = useState<PublicCareer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/career');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch careers');
      }

      if (data.success) {
        setCareers(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch careers');
      }
    } catch (err: any) {
      console.error('Error fetching careers:', err);
      setError(err.message || 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return {
    careers,
    loading,
    error,
    refetch: fetchCareers,
  };
};
