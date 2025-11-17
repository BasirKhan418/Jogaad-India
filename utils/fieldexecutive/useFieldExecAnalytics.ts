import { useState, useEffect } from 'react';

/**
 * Analytics Data Interface
 */
export interface AnalyticsData {
  assignTarget: number;
  currentTarget: number;
}

/**
 * Analytics Hook Response
 */
interface UseAnalyticsReturn {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch field executive analytics
 * Follows SRP - Single responsibility of fetching analytics data
 */
export const useFieldExecAnalytics = (): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/field-e/analytics');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch analytics');
      }

      setAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics };
};
