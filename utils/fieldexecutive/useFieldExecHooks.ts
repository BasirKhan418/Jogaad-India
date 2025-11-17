

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFieldExecData } from './fieldExecAuthService';
import { toast } from 'sonner';
import { logoutUser } from '@/actions/logout';

export interface FieldExecutiveData {
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

/**
 * Hook to fetch and manage field executive data
 */
export const useFieldExecData = () => {
  const [fieldExecData, setFieldExecData] = useState<FieldExecutiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFieldExecData();
        
        if (response.success && response.data) {
          setFieldExecData(response.data);
        } else {
          setError(response.message || "Failed to fetch profile data");
          toast.error(response.message || "Failed to fetch profile data");
          
          // Redirect to login if unauthorized
          if (response.message?.includes("Unauthorized") || response.message?.includes("Invalid")) {
            setTimeout(() => {
              router.push('/field-executive/login');
            }, 2000);
          }
        }
      } catch (err) {
        const errorMsg = "Failed to load profile data";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return { fieldExecData, loading, error };
};

/**
 * Hook to handle field executive logout
 */
export const useFieldExecLogout = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push('/');
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  }, [router]);

  return { handleLogout };
};

/**
 * Hook to manage sidebar state
 */
export const useFieldExecSidebar = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
