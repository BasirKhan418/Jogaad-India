import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';

export interface FieldExecutive {
  _id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  block?: string;
  isActive: boolean;
  phone: string;
  img?: string;
  target?: number;
  targetDate?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface FieldExecutiveStats {
  total: number;
  active: number;
  inactive: number;
}

interface UseFieldExecutiveDataReturn {
  fieldExecutives: FieldExecutive[];
  stats: FieldExecutiveStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  handleDelete: (id: string) => Promise<boolean>;
  handleToggleStatus: (id: string, currentStatus: boolean) => Promise<boolean>;
  deleting: string | null;
  toggling: string | null;
}

export const useFieldExecutiveData = (): UseFieldExecutiveDataReturn => {
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFieldExecutives = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/v1/manage-field-e', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
        cache: 'no-store'
      });

      const data = await response.json();

      if (data.success) {
        setFieldExecutives(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch field executives');
        toast.error(data.message || 'Failed to fetch field executives');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('Network error occurred');
      toast.error('Failed to fetch field executives');
      console.error('Fetch field executives error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFieldExecutives();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleDelete = useCallback(async (id: string): Promise<boolean> => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/v1/manage-field-e`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isActive: false }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field Executive deactivated successfully');
        await fetchFieldExecutives();
        return true;
      } else {
        toast.error(data.message || 'Failed to deactivate field executive');
        return false;
      }
    } catch (err) {
      toast.error('Failed to deactivate field executive');
      console.error('Delete field executive error:', err);
      return false;
    } finally {
      setDeleting(null);
    }
  }, [fetchFieldExecutives]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: boolean): Promise<boolean> => {
    setToggling(id);
    try {
      const response = await fetch(`/api/v1/manage-field-e`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Field Executive ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await fetchFieldExecutives();
        return true;
      } else {
        toast.error(data.message || 'Failed to update status');
        return false;
      }
    } catch (err) {
      toast.error('Failed to update status');
      console.error('Toggle status error:', err);
      return false;
    } finally {
      setToggling(null);
    }
  }, [fetchFieldExecutives]);

  const stats: FieldExecutiveStats = useMemo(() => ({
    total: fieldExecutives.length,
    active: fieldExecutives.filter(fe => fe.isActive).length,
    inactive: fieldExecutives.filter(fe => !fe.isActive).length,
  }), [fieldExecutives]);

  return {
    fieldExecutives,
    stats,
    loading,
    error,
    refetch: fetchFieldExecutives,
    handleDelete,
    handleToggleStatus,
    deleting,
    toggling,
  };
};
