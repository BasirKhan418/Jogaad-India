import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  sendSignupOtp, 
  completeSignup, 
  resendSignupOtp, 
  SignupRequest, 
  ApiResponse 
} from './signupService';

export type SignupStep = 'details' | 'otp';

export interface UseSignupReturn {
  step: SignupStep;
  loading: boolean;
  error: string;
  success: string;
  formData: SignupRequest;
  otp: string;

  setStep: (step: SignupStep) => void;
  setFormData: (data: SignupRequest) => void;
  setOtp: (otp: string) => void;
  clearMessages: () => void;
  resetForm: () => void;

  sendOtp: () => Promise<boolean>;
  submitSignup: () => Promise<boolean>;
  resendOtp: () => Promise<boolean>;

  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goBackToDetails: () => void;
  
  getFieldError: (fieldName: keyof SignupRequest) => string | null;
  isFormValid: boolean;
}

const initialFormData: SignupRequest = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

export const useSignup = (): UseSignupReturn => {
  const [step, setStep] = useState<SignupStep>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<SignupRequest>(initialFormData);
  const [otp, setOtp] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);


  const resetForm = useCallback(() => {
    setStep('details');
    setFormData(initialFormData);
    setOtp('');
    clearMessages();
    setLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearMessages]);

  
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
        setError(result.message || 'An error occurred');
        toast.error(result.message || 'An error occurred');
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      console.error('API call error:', error);
      const errorMessage = 'Network error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  
  const validateFormData = useCallback((): string | null => {
    if (!formData.name?.trim()) {
      return 'Name is required';
    }
    
    if (!formData.email?.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  }, [formData]);

  const sendOtpAction = useCallback(async (): Promise<boolean> => {
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      return false;
    }

    const success = await handleApiCall(
      () => sendSignupOtp(formData.email, abortControllerRef.current?.signal),
      'OTP sent to your email!'
    );

    if (success) {
      setStep('otp');
    }

    return success;
  }, [formData.email, handleApiCall, validateFormData, loading]);

  const submitSignup = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    
    if (!otp?.trim()) {
      setError('OTP is required');
      return false;
    }
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return false;
    }
    
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must contain only numbers');
      return false;
    }

    const success = await handleApiCall(
      () => completeSignup(formData, otp, abortControllerRef.current?.signal),
      'Account created successfully!'
    );

    if (success) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }

    return success;
  }, [formData, otp, handleApiCall, loading]);


  const resendOtpAction = useCallback(async (): Promise<boolean> => {
    return await handleApiCall(
      () => resendSignupOtp(formData.email, abortControllerRef.current?.signal),
      'OTP resent successfully'
    );
  }, [formData.email, handleApiCall]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (error) {
      setError('');
    }
  }, [error]);

  const goBackToDetails = useCallback(() => {
    setStep('details');
    setOtp('');
    clearMessages();
  }, [clearMessages]);


  const getFieldError = useCallback((fieldName: keyof SignupRequest): string | null => {
    switch (fieldName) {
      case 'name':
        if (!formData.name?.trim()) return 'Name is required';
        break;
      case 'email':
        if (!formData.email?.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (formData.phone && formData.phone.trim()) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
            return 'Please enter a valid phone number';
          }
        }
        break;
      case 'address':
        break;
    }
    return null;
  }, [formData]);

 
  const isFormValid = useMemo(() => {
    return !getFieldError('name') && !getFieldError('email') && !getFieldError('phone');
  }, [getFieldError]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  return {
    step,
    loading,
    error,
    success,
    formData,
    otp,

    setStep,
    setFormData,
    setOtp,
    clearMessages,
    resetForm,

    sendOtp: sendOtpAction,
    submitSignup,
    resendOtp: resendOtpAction,

    handleInputChange,
    goBackToDetails,
    
    getFieldError,
    isFormValid
  };
};