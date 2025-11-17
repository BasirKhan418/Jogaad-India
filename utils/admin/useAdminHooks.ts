import { useState, useEffect } from 'react';
import { getAdminData, logoutAdmin, AdminData } from '@/utils/admin/adminAuthService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseAdminDataReturn {
  adminData: AdminData | null;
  loading: boolean;
  error: string;
  refetch: () => void;
}

export const useAdminData = (): UseAdminDataReturn => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchAdminData = async (retryCount = 0) => {
    try {
      setError('');
      const result = await getAdminData();
      if (result.success && result.data) {
        setAdminData(result.data);
      } else {
        if (retryCount < 1) {
          setTimeout(() => {
            fetchAdminData(retryCount + 1);
          }, 1000);
        } else {
          setError(result.message || 'Failed to load admin data');
        }
      }
    } catch (error: any) {
      if (retryCount < 1) {
        setTimeout(() => {
          fetchAdminData(retryCount + 1);
        }, 2000);
      } else {
        console.error('Error fetching admin data:', error);
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchAdminData();
  };

  return { adminData, loading, error, refetch };
};

export const useAdminLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result.success) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        console.error('Logout failed:', result.message);
        toast.error('Logout failed');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      router.push('/');
    }
  };

  return { handleLogout };
};

export const useAdminSidebar = () => {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
};

export const useAdminDataWithForm = (initialFormData: any) => {
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState(initialFormData);

  const fetchAdminData = async (retryCount = 0) => {
    try {
      setError('');
      const result = await getAdminData();
      if (result.success && result.data) {
        setAdminData(result.data);
        setFormData({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          img: result.data.img || '',
        });
      } else {
        if (retryCount < 1) {
          setTimeout(() => {
            fetchAdminData(retryCount + 1);
          }, 1000);
        } else {
          setError(result.message || 'Failed to load admin data');
          setTimeout(() => {
            router.push('/admin/signin');
          }, 2000);
        }
      }
    } catch (error: any) {
      if (retryCount < 1) {
        setTimeout(() => {
          fetchAdminData(retryCount + 1);
        }, 2000);
      } else {
        console.error('Error fetching admin data:', error);
        setError(error.message || 'An unexpected error occurred');
        setTimeout(() => {
          router.push('/admin/signin');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchAdminData();
  };

  return { adminData, loading, error, formData, setFormData, refetch };
};