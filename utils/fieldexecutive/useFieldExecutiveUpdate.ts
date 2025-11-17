import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  uploadImage,
  ApiResponse
} from './fieldExecutiveApiService';

export interface FieldExecutiveUpdateData {
  id?: string;
  name: string;
  email: string;
  address?: string;
  phone: string;
  pincode?: string;
  block?: string;
  img?: string;
  target?: number;
  isActive?: boolean;
}

export interface UseFieldExecutiveUpdateReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: FieldExecutiveUpdateData;
  imagePreview: string;
  
  setFormData: (data: FieldExecutiveUpdateData) => void;
  clearMessages: () => void;
  
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitFieldExecutiveUpdate: () => Promise<boolean>;
  
  isFormValid: boolean;
}

export const useFieldExecutiveUpdate = (initialData?: FieldExecutiveUpdateData): UseFieldExecutiveUpdateReturn => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FieldExecutiveUpdateData>(
    initialData || {
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
      block: '',
      img: '',
      isActive: true
    }
  );
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
  }, []);

  // Set initial image preview if img exists
  useEffect(() => {
    if (initialData?.img && !imagePreview) {
      setImagePreview(initialData.img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only set on mount

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, name, value, type } = e.target;
    const fieldName = name || id;
    
    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [fieldName]: numValue }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [fieldName]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
    
    clearMessages();
  }, [clearMessages]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    clearMessages();

    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(preview);

      // Upload to server
      const result = await uploadImage(file);

      if (result.success && result.data?.url) {
        setFormData(prev => ({ ...prev, img: result.data!.url }));
        toast.success('Image uploaded successfully');
      } else {
        // Revert preview on failure
        URL.revokeObjectURL(preview);
        setImagePreview(initialData?.img || '');
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  }, [clearMessages, imagePreview, initialData?.img]);

  const submitFieldExecutiveUpdate = useCallback(async (): Promise<boolean> => {
    clearMessages();

    // Validate that ID is present
    if (!formData.id) {
      setError('Field Executive ID is required for update');
      toast.error('Field Executive ID is required for update');
      return false;
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return false;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      toast.error('Phone number must be at least 10 digits');
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/manage-field-e', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Field Executive updated successfully');
        toast.success('Field Executive updated successfully');
        return true;
      } else {
        setError(result.message || 'Failed to update field executive');
        toast.error(result.message || 'Failed to update field executive');
        return false;
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('Failed to update field executive');
      console.error('Update field executive error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, clearMessages]);

  const isFormValid = useMemo(() => {
    return !!(
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.phone.length >= 10
    );
  }, [formData]);

  return {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    imagePreview,
    setFormData,
    clearMessages,
    handleInputChange,
    handleImageUpload,
    submitFieldExecutiveUpdate,
    isFormValid,
  };
};
