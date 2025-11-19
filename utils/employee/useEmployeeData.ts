import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';

export interface Employee {
  _id: string;
  name: string;
  email: string;
  address?: string;
  phone: string;
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
  categoryid?: {
    _id: string;
    categoryName: string;
    categoryType: string;
    categoryDescription?: string;
    categoryUnit?: string;
    recommendationPrice?: number;
    categoryMinPrice?: number;
    categoryMaxPrice?: number;
    categoryStatus?: boolean;
    img?: string;
  };
  payrate?: number;
  createdAt: string;
  updatedAt: string;
  totalEarnings?: number;
  youEarn?: number;
  bookingsCount?: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  paid: number;
  pending: number;
}

interface UseEmployeeDataReturn {
  employees: Employee[];
  stats: EmployeeStats;
  loading: boolean;
  error: string | null;
  refetch: (startDate?: string, endDate?: string) => Promise<void>;
  handleDelete: (email: string) => Promise<boolean>;
  deleting: string | null;
}

export const useEmployeeData = (): UseEmployeeDataReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      let url = '/api/v1/admin/analytics/employee';
      if (startDate && endDate) {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
        cache: 'no-store'
      });

      const data = await response.json();

      if (data.status) {
        setEmployees(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch employees');
        toast.error(data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('Network error occurred');
      toast.error('Failed to fetch employees');
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleDelete = useCallback(async (email: string): Promise<boolean> => {
    setDeleting(email);
    try {
      const response = await fetch(`/api/v1/employee/${email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Employee deleted successfully');
        await fetchEmployees();
        return true;
      } else {
        toast.error(data.message || 'Failed to delete employee');
        return false;
      }
    } catch (err) {
      toast.error('Failed to delete employee');
      console.error('Delete employee error:', err);
      return false;
    } finally {
      setDeleting(null);
    }
  }, [fetchEmployees]);

  const stats: EmployeeStats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(emp => emp.isActive).length,
    inactive: employees.filter(emp => !emp.isActive).length,
    paid: employees.filter(emp => emp.isPaid).length,
    pending: employees.filter(emp => !emp.isPaid).length,
  }), [employees]);

  return {
    employees,
    stats,
    loading,
    error,
    refetch: fetchEmployees,
    handleDelete,
    deleting,
  };
};
