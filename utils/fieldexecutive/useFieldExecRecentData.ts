import { useState, useEffect, useCallback } from 'react';

/**
 * Employee Data Interface
 */
export interface EmployeeData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  pincode?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  img?: string;
  isPaid: boolean;
  isActive: boolean;
  orderid?: string;
  paymentid?: string;
  paymentStatus: string;
  categoryid?: string;
  payrate?: number;
  feid?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Recent Data Hook Response
 */
interface UseRecentDataReturn {
  employees: EmployeeData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: (start: number, limit: number) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch field executive recent employees data
 * Follows SRP - Single responsibility of fetching and managing employee data
 * @param initialLimit - Number of employees to fetch initially (default: 5 for top portion)
 */
export const useFieldExecRecentData = (initialLimit: number = 5): UseRecentDataReturn => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch initial employees without pagination (top N)
   */
  const fetchInitialEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/field-e/analytics/recentdata');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recent data');
      }

      // Take only the initial limit for top portion
      const limitedEmployees = data.data.slice(0, initialLimit);
      setEmployees(limitedEmployees);
      setHasMore(data.data.length > initialLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent data');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch more employees with pagination
   */
  const fetchMore = useCallback(async (start: number, limit: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/field-e/analytics/recentdata?start=${start}&limit=${limit}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch more data');
      }

      setEmployees(data.data);
      setHasMore(data.data.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch more data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialEmployees();
  }, [initialLimit]);

  return {
    employees,
    loading,
    error,
    hasMore,
    fetchMore,
    refetch: fetchInitialEmployees,
  };
};
