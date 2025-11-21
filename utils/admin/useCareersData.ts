import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Career {
  _id: string;
  role: string;
  experience: string;
  requirements: string[];
  description: string;
  location: string;
  mode: 'remote' | 'offline' | 'hybrid';
  applyUrl: string;
  salary?: string;
  department?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  skills?: string[];
  benefits?: string[];
  isActive: boolean;
  applicationDeadline?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  lastEditedAuthor: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean;
}

export interface CareerFormData {
  role: string;
  experience: string;
  requirements: string[];
  description: string;
  location: string;
  mode: 'remote' | 'offline' | 'hybrid';
  applyUrl: string;
  salary?: string;
  department?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  skills?: string[];
  benefits?: string[];
  isActive: boolean;
  applicationDeadline?: string;
}

export const useCareersData = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/admin-career');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch careers');
      }

      if (data.success) {
        setCareers(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch careers');
      }
    } catch (err: any) {
      console.error('Error fetching careers:', err);
      setError(err.message || 'Failed to fetch careers');
      toast.error(err.message || 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCareer = useCallback(async (careerData: CareerFormData): Promise<boolean> => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/v1/admin-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create career');
      }

      if (data.success) {
        toast.success('Career created successfully');
        await fetchCareers();
        return true;
      } else {
        throw new Error(data.message || 'Failed to create career');
      }
    } catch (err: any) {
      console.error('Error creating career:', err);
      toast.error(err.message || 'Failed to create career');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchCareers]);

  const updateCareer = useCallback(async (id: string, careerData: Partial<CareerFormData>): Promise<boolean> => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/v1/admin-career?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update career');
      }

      if (data.success) {
        toast.success('Career updated successfully');
        await fetchCareers();
        return true;
      } else {
        throw new Error(data.message || 'Failed to update career');
      }
    } catch (err: any) {
      console.error('Error updating career:', err);
      toast.error(err.message || 'Failed to update career');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchCareers]);

  const deleteCareer = useCallback(async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/v1/admin-career?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete career');
      }

      if (data.success) {
        toast.success('Career deleted successfully');
        await fetchCareers();
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete career');
      }
    } catch (err: any) {
      console.error('Error deleting career:', err);
      toast.error(err.message || 'Failed to delete career');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchCareers]);

  const toggleCareerStatus = useCallback(async (id: string, currentStatus: boolean): Promise<boolean> => {
    return updateCareer(id, { isActive: !currentStatus });
  }, [updateCareer]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return {
    careers,
    loading,
    error,
    actionLoading,
    fetchCareers,
    createCareer,
    updateCareer,
    deleteCareer,
    toggleCareerStatus,
  };
};
