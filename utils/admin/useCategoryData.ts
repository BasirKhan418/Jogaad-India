import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { 
  fetchAllCategories, 
  fetchCategoriesByType,
  calculateCategoryStats,
  deleteCategory,
  Category,
  CategoryStats,
  ApiResponse 
} from './categoryService';

export interface UseCategoryDataReturn {
  categories: Category[];
  serviceCategories: Category[];
  maintenanceCategories: Category[];
  stats: CategoryStats;
  loading: boolean;
  error: string;
  deleting: boolean;
  refetch: () => void;
  fetchByType: (type: 'Service' | 'Maintenance') => Promise<void>;
  handleDelete: (categoryId: string) => Promise<boolean>;
}

export const useCategoryData = (): UseCategoryDataReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [maintenanceCategories, setMaintenanceCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({ total: 0, service: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async (retryCount = 0) => {
    try {
      setError('');
      setLoading(true);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await fetchAllCategories(abortControllerRef.current.signal);
      
      if (result.success && result.data) {
        const allCategories = result.data.categories;
        setCategories(allCategories);
        
        // Separate by type
        const services = allCategories.filter(cat => cat.categoryType === 'Service');
        const maintenance = allCategories.filter(cat => cat.categoryType === 'Maintenance');
        
        setServiceCategories(services);
        setMaintenanceCategories(maintenance);
        
        // Calculate stats
        const categoryStats = calculateCategoryStats(allCategories);
        setStats(categoryStats);
      } else {
        if (retryCount < 1) {
          setTimeout(() => {
            fetchCategories(retryCount + 1);
          }, 1000);
        } else {
          setError(result.message || 'Failed to load categories');
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }

      if (retryCount < 1) {
        setTimeout(() => {
          fetchCategories(retryCount + 1);
        }, 2000);
      } else {
        console.error('Error fetching categories:', error);
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByType = useCallback(async (type: 'Service' | 'Maintenance') => {
    try {
      setLoading(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await fetchCategoriesByType(type, abortControllerRef.current.signal);
      
      if (result.success && result.data) {
        if (type === 'Service') {
          setServiceCategories(result.data.categories);
        } else {
          setMaintenanceCategories(result.data.categories);
        }
        toast.success(`${type} categories loaded successfully`);
      } else {
        toast.error(result.message || `Failed to load ${type} categories`);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error(`Error fetching ${type} categories:`, error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (categoryId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await deleteCategory(categoryId, abortControllerRef.current.signal);
      
      if (result.success) {
        toast.success('Category deleted successfully');
        // Refetch categories after deletion
        await fetchCategories();
        return true;
      } else {
        toast.error(result.message || 'Failed to delete category');
        return false;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return false;
      }
      console.error('Error deleting category:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  return {
    categories,
    serviceCategories,
    maintenanceCategories,
    stats,
    loading,
    error,
    deleting,
    refetch: fetchCategories,
    fetchByType,
    handleDelete
  };
};
