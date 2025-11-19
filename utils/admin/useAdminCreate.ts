import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  createAdminByAdmin, 
  uploadAdminImage,
  AdminCreateRequest, 
  ApiResponse 
} from './adminCreateService';

export interface UseAdminCreateReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: AdminCreateRequest;
  imagePreview: string;

  setFormData: (data: AdminCreateRequest) => void;
  clearMessages: () => void;
  resetForm: () => void;

  createAdmin: () => Promise<boolean>;
  handleImageUpload: (file: File) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  isFormValid: boolean;
}

const initialFormData: AdminCreateRequest = {
  name: '',
  email: '',
  phone: '',
  img: ''
};

export const useAdminCreate = (): UseAdminCreateReturn => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<AdminCreateRequest>(initialFormData);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Cleanup image preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
    clearMessages();
    setLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearMessages, imagePreview]);

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

    // Create preview
    const preview = URL.createObjectURL(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      const result = await uploadAdminImage(file);
      if (result.success && result.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: result.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
        setImagePreview('');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  }, [imagePreview]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    clearMessages();
  }, [clearMessages]);

  const createAdmin = useCallback(async (): Promise<boolean> => {
    if (!formData.email) {
      toast.error('Please enter admin email');
      return false;
    }

    if (!formData.name) {
      toast.error('Please enter admin name');
      return false;
    }

    clearMessages();
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await createAdminByAdmin(formData, abortControllerRef.current.signal);
      
      if (result.success) {
        setSuccess(result.message || 'Admin created successfully!');
        toast.success(result.message || 'Admin created successfully!');
        // Reset form after successful creation
        setTimeout(() => {
          resetForm();
        }, 2000);
        return true;
      } else {
        const errorMsg = result.message || 'Failed to create admin';
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
  }, [formData, clearMessages, resetForm]);

  const isFormValid = !!(formData.name && formData.email);

  return {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    imagePreview,
    setFormData,
    clearMessages,
    resetForm,
    createAdmin,
    handleImageUpload,
    handleInputChange,
    isFormValid
  };
};
