import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  createFieldExecutiveAccount,
  uploadImage,
  FieldExecutiveCreateRequest,
  ApiResponse
} from './fieldExecutiveApiService';
import { useRouter } from 'next/navigation';

export interface UseFieldExecutiveCreationReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: FieldExecutiveCreateRequest;
  imagePreview: string;
  
  setFormData: (data: FieldExecutiveCreateRequest) => void;
  clearMessages: () => void;
  resetForm: () => void;
  
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitFieldExecutiveCreation: () => Promise<boolean>;
  
  isFormValid: boolean;
}

const initialFormData: FieldExecutiveCreateRequest = {
  name: '',
  email: '',
  address: '',
  phone: '',
  pincode: '',
  block: '',
  img: ''
};

export const useFieldExecutiveCreation = (): UseFieldExecutiveCreationReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FieldExecutiveCreateRequest>(initialFormData);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, name, value, type } = e.target;
    const fieldName = name || id;
    
    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [fieldName]: numValue }));
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
      setImagePreview(preview);

      // Upload to server
      const result = await uploadImage(file);

      if (result.success && result.data?.url) {
        setFormData(prev => ({ ...prev, img: result.data!.url }));
        toast.success('Image uploaded successfully');
      } else {
        // Revert preview on failure
        URL.revokeObjectURL(preview);
        setImagePreview('');
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  }, [clearMessages]);

  const submitFieldExecutiveCreation = useCallback(async (): Promise<boolean> => {
    clearMessages();

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
      const result = await createFieldExecutiveAccount(formData);

      if (result.success) {
        setSuccess(result.message || 'Field Executive created successfully');
        toast.success('Field Executive created successfully');
        return true;
      } else {
        setError(result.message || 'Failed to create field executive');
        toast.error(result.message || 'Failed to create field executive');
        return false;
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('Failed to create field executive');
      console.error('Create field executive error:', error);
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
    resetForm,
    handleInputChange,
    handleImageUpload,
    submitFieldExecutiveCreation,
    isFormValid,
  };
};
