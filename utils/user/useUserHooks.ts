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


export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching user data...");
        const response = await getUserData();
        
        console.log("User data response:", response);
        
        if (response.success && response.data) {
          console.log("Setting user data:", response.data);
          setUserData(response.data);
        } else {
          console.error("Failed to fetch user data:", response.message);
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
        console.error("Exception in fetchData:", err);
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


export const useUserSidebar = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
