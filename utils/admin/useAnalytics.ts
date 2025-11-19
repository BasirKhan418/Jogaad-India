import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface AnalyticsData {
  totalEarnings: number;
  employeeFee: number;
}

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: (startDate?: string, endDate?: string) => Promise<void>;
}


export const useAnalytics = (
  initialStartDate?: string,
  initialEndDate?: string
): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      let url = '/api/v1/admin/analytics/dashboard';
      
      // Add date parameters if provided
      if (startDate && endDate) {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        setError(result.message || 'Failed to fetch analytics data');
        toast.error(result.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Network error occurred');
      toast.error('Failed to fetch analytics data');
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(initialStartDate, initialEndDate);
  }, [fetchAnalytics, initialStartDate, initialEndDate]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
