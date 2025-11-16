import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface EmployeeData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  pincode?: string;
  img?: string;
  categoryid?: string;
  payrate?: number;
  isPaid: boolean;
  isActive: boolean;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cache for employee data to prevent unnecessary re-fetches
const employeeCache = {
  data: null as EmployeeData | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes cache
  isValid() {
    return this.data && (Date.now() - this.timestamp) < this.ttl;
  },
  set(data: EmployeeData | null) {
    this.data = data;
    this.timestamp = Date.now();
  },
  clear() {
    this.data = null;
    this.timestamp = 0;
  }
};

/**
 * Hook to fetch employee data
 */
export const useEmployeeData = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(employeeCache.data);
  const [loading, setLoading] = useState(!employeeCache.isValid());
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If cache is valid, use cached data and don't show loading
    if (employeeCache.isValid()) {
      setEmployeeData(employeeCache.data);
      setLoading(false);
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('/api/v1/employee-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || 'Failed to fetch employee data');
          employeeCache.clear();
          setLoading(false);
          return;
        }

        setEmployeeData(data.data);
        employeeCache.set(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employee data');
        employeeCache.clear();
        console.error('Employee data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  return { employeeData, loading, error };
};

/**
 * Hook for employee logout
 */
export const useEmployeeLogout = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear employee data cache on logout
        employeeCache.clear();
        toast.success('Logged out successfully');
        router.push('/employee/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  }, [router]);

  return { handleLogout };
};

/**
 * Hook for sidebar state
 */
export const useEmployeeSidebar = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
