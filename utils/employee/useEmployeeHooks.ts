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

/**
 * Hook to fetch employee data
 */
export const useEmployeeData = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
          setLoading(false);
          return;
        }

        setEmployeeData(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employee data');
        console.error('Employee data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

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
