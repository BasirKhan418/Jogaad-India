import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  fetchAllCategories,
  uploadImage,
  CategoryData,
  ApiResponse
} from './employeeApiService';

export interface EmployeeUpdateData {
  name: string;
  email: string;
  address?: string;
  phone: string;
  pincode: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  img?: string;
  categoryid: string;
  payrate: number;
}

export interface UseEmployeeUpdateReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: EmployeeUpdateData;
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  imagePreview: string;
  
  setFormData: (data: EmployeeUpdateData) => void;
  clearMessages: () => void;
  
  fetchCategories: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCategorySelect: (categoryId: string) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitEmployeeUpdate: () => Promise<boolean>;
  
  isFormValid: boolean;
  priceError: string;
}

export const useEmployeeUpdate = (initialData?: EmployeeUpdateData): UseEmployeeUpdateReturn => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formData, setFormData] = useState<EmployeeUpdateData>(
    initialData || {
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
      bankName: '',
      bankAccountNumber: '',
      bankIfscCode: '',
      img: '',
      categoryid: '',
      payrate: 0
    }
  );
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    const currentPreview = imagePreview;
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on unmount

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
    setPriceError('');
  }, []);

  const validatePrice = useCallback((price: number): boolean => {
    if (!selectedCategory) {
      setPriceError('Please select a category first');
      return false;
    }

    const minPrice = selectedCategory.categoryMinPrice || 0;
    const maxPrice = selectedCategory.categoryMaxPrice || 0;

    if (price < minPrice) {
      setPriceError(`Price must be at least ₹${minPrice.toLocaleString()}`);
      return false;
    }

    if (price > maxPrice) {
      setPriceError(`Price cannot exceed ₹${maxPrice.toLocaleString()}`);
      return false;
    }

    setPriceError('');
    return true;
  }, [selectedCategory]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set initial image preview if img exists
  useEffect(() => {
    if (initialData?.img && !imagePreview) {
      setImagePreview(initialData.img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only set on mount

  // Set selected category when categoryid changes
  useEffect(() => {
    if (formData.categoryid && categories.length > 0) {
      const category = categories.find(cat => cat._id === formData.categoryid);
      setSelectedCategory(category || null);
    }
  }, [formData.categoryid, categories]);

  // Validate price when category or payrate changes
  useEffect(() => {
    if (selectedCategory && formData.payrate > 0) {
      validatePrice(formData.payrate);
    } else {
      setPriceError('');
    }
  }, [selectedCategory, formData.payrate, validatePrice]);

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchAllCategories(abortControllerRef.current.signal);
      
      if (result.success && result.data?.categories) {
        const activeCategories = result.data.categories.filter(cat => cat.categoryStatus);
        setCategories(activeCategories);
      } else {
        toast.error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toast.error('Failed to fetch categories');
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [id]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    
    clearMessages();
  }, [clearMessages]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setFormData(prev => {
      const category = categories.find(cat => cat._id === categoryId);
      setSelectedCategory(category || null);
      return { 
        ...prev, 
        categoryid: categoryId,
        payrate: category?.recommendationPrice || prev.payrate
      };
    });
    clearMessages();
  }, [categories, clearMessages]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(preview);

    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: result.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
        setImagePreview(formData.img || '');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview(formData.img || '');
    } finally {
      setUploadingImage(false);
    }
  }, [imagePreview, formData.img]);

  const submitEmployeeUpdate = useCallback(async (): Promise<boolean> => {
    clearMessages();

    if (!formData.name) {
      toast.error('Please enter employee name');
      return false;
    }

    if (!formData.email) {
      toast.error('Please enter employee email');
      return false;
    }

    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    if (!formData.categoryid) {
      toast.error('Please select a category');
      return false;
    }

    if (!formData.payrate || formData.payrate <= 0) {
      toast.error('Please enter a valid pay rate');
      return false;
    }

    if (!validatePrice(formData.payrate)) {
      return false;
    }

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/v1/create-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Profile updated successfully');
        setSuccess(data.message || 'Profile updated successfully');
        return true;
      } else {
        const errorMsg = data.message || 'Failed to update profile';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      const errorMsg = 'Network error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validatePrice, clearMessages]);

  const isFormValid = useMemo(() => !!(
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.phone.length >= 10 &&
    formData.categoryid &&
    formData.payrate > 0 &&
    !priceError
  ), [formData.name, formData.email, formData.phone, formData.categoryid, formData.payrate, priceError]);

  return {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    
    setFormData,
    clearMessages,
    
    fetchCategories,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitEmployeeUpdate,
    
    isFormValid
  };
};
