import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserData } from './userAuthService';
import { toast } from 'sonner';
import { logoutUser } from '@/actions/logout';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  phone: string;
  img?: string;
  isVerified: boolean;
  isImposedFine: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to fetch and manage user data
 * Follows SRP - Single responsibility of managing user data state
 */
export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          setError(response.message || "Failed to fetch profile data");
          toast.error(response.message || "Failed to fetch profile data");
          
          // Redirect to login if unauthorized
          if (response.message?.includes("Unauthorized") || response.message?.includes("Invalid")) {
            setTimeout(() => {
              router.push('/signin');
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

  return { userData, loading, error };
};

/**
 * Hook to handle user logout
 * Follows SRP - Single responsibility of handling logout
 */
export const useUserLogout = () => {
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
 * Follows SRP - Single responsibility of managing sidebar state
 */
export const useUserSidebar = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
