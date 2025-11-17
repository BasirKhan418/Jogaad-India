import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { uploadImageToS3, ApiResponse } from './userApiService';

export interface UserUpdateData {
  name: string;
  email: string;
  address?: string;
  phone: string;
  pincode?: string;
  img?: string;
}

export interface UseUserUpdateReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: UserUpdateData;
  imagePreview: string;
  
  setFormData: (data: UserUpdateData) => void;
  clearMessages: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitUserUpdate: () => Promise<boolean>;
  isFormValid: boolean;
}


export const useUserUpdate = (initialData?: UserUpdateData): UseUserUpdateReturn => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<UserUpdateData>(
    initialData || {
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
      img: ''
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
  }, []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearMessages();
  }, [clearMessages]);

  /**
   * Handle image upload to S3
   */
  const handleImageUpload = useCallback(async (file: File): Promise<void> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      clearMessages();

      // Create preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      // Upload to S3
      const response = await uploadImageToS3(file);

      if (response.success && response.data?.imageUrl) {
        setFormData(prev => ({ ...prev, img: response.data.imageUrl }));
        toast.success('Image uploaded successfully');
      } else {
        setImagePreview('');
        toast.error(response.message || 'Failed to upload image');
      }
    } catch (error) {
      setImagePreview('');
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  }, [clearMessages]);

  /**
   * Submit user profile update
   */
  const submitUserUpdate = useCallback(async (): Promise<boolean> => {
    clearMessages();
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      setLoading(false);
      return false;
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      setError('Pincode must be 6 digits');
      setLoading(false);
      return false;
    }

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/v1/user/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal,
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        toast.success('Profile updated successfully!');
        return true;
      } else {
        setError(data.message || 'Failed to update profile');
        toast.error(data.message || 'Failed to update profile');
        return false;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return false;
      }
      const errorMsg = 'Failed to update profile. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, clearMessages]);

  /**
   * Check if form is valid for submission
   */
  const isFormValid = useMemo(() => {
    return formData.name.trim().length > 0;
  }, [formData.name]);

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
    submitUserUpdate,
    isFormValid,
  };
};
