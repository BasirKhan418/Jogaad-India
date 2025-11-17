import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDashboardStats, DashboardStats } from './dashboardService';
import { toast } from 'sonner';

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchDashboardStats(abortControllerRef.current.signal);
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to fetch dashboard stats');
        toast.error(result.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('Network error occurred');
      toast.error('Failed to fetch dashboard statistics');
      console.error('Fetch dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};