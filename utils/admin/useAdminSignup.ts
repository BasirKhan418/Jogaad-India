import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  sendAdminSignupOtp, 
  completeAdminSignup, 
  resendAdminSignupOtp, 
  uploadImage,
  AdminSignupRequest, 
  ApiResponse 
} from './adminSignupService';
import { useRouter } from 'next/navigation';

export type AdminSignupStep = 'details' | 'otp';

export interface UseAdminSignupReturn {
  step: AdminSignupStep;
  loading: boolean;
  error: string;
  success: string;
  formData: AdminSignupRequest;
  otp: string;
  imageFile: File | null;
  imagePreview: string;
  uploadingImage: boolean;

  setStep: (step: AdminSignupStep) => void;
  setFormData: (data: AdminSignupRequest) => void;
  setOtp: (otp: string) => void;
  setImageFile: (file: File | null) => void;
  clearMessages: () => void;
  resetForm: () => void;

  sendOtp: () => Promise<boolean>;
  submitSignup: () => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  handleImageUpload: (file: File) => Promise<void>;

  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goBackToDetails: () => void;
  
  isFormValid: boolean;
}

const initialFormData: AdminSignupRequest = {
  name: '',
  email: '',
  phone: '',
  img: '',
  password: ''
};

export const useAdminSignup = (): UseAdminSignupReturn => {
  const router = useRouter();
  const [step, setStep] = useState<AdminSignupStep>('details');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<AdminSignupRequest>(initialFormData);
  const [otp, setOtp] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    setStep('details');
    setFormData(initialFormData);
    setOtp('');
    setImageFile(null);
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

  const handleApiCall = useCallback(async (
    apiCall: () => Promise<ApiResponse>,
    successMessage?: string
  ): Promise<boolean> => {
    clearMessages();
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await apiCall();
      
      if (result.success) {
        if (successMessage) {
          setSuccess(successMessage);
          toast.success(successMessage);
        }
        return true;
      } else {
        const errorMsg = result.message || 'An error occurred';
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

    setImageFile(file);
    
    // Create preview
    const preview = URL.createObjectURL(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: result.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
        setImageFile(null);
        setImagePreview('');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImageFile(null);
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

  const sendOtp = useCallback(async (): Promise<boolean> => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }

    if (!formData.name) {
      toast.error('Please enter your name');
      return false;
    }

    if (!formData.password) {
      toast.error('Please enter admin credential password');
      return false;
    }

    const success = await handleApiCall(
      () => sendAdminSignupOtp(formData.email, abortControllerRef.current?.signal),
      'OTP sent to your email'
    );

    if (success) {
      setStep('otp');
    }

    return success;
  }, [formData.email, formData.name, formData.password, handleApiCall]);

  const submitSignup = useCallback(async (): Promise<boolean> => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return false;
    }

    const success = await handleApiCall(
      () => completeAdminSignup(formData, otp, abortControllerRef.current?.signal),
      'Admin account created successfully!'
    );

    if (success) {
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    }

    return success;
  }, [formData, otp, handleApiCall, router]);

  const resendOtp = useCallback(async (): Promise<boolean> => {
    return handleApiCall(
      () => resendAdminSignupOtp(formData.email, abortControllerRef.current?.signal),
      'OTP resent successfully'
    );
  }, [formData.email, handleApiCall]);

  const goBackToDetails = useCallback(() => {
    setStep('details');
    setOtp('');
    clearMessages();
  }, [clearMessages]);

  const isFormValid = formData.name && formData.email && formData.password;

  return {
    step,
    loading,
    error,
    success,
    formData,
    otp,
    imageFile,
    imagePreview,
    uploadingImage,
    setStep,
    setFormData,
    setOtp,
    setImageFile,
    clearMessages,
    resetForm,
    sendOtp,
    submitSignup,
    resendOtp,
    handleImageUpload,
    handleInputChange,
    goBackToDetails,
    isFormValid: !!isFormValid
  };
};
