import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  sendAdminOtp, 
  verifyAdminOtp, 
  validateEmail, 
  validateOtp,
  AdminData,
  ApiResponse 
} from './adminAuthService';

interface ValidationErrors {
  email?: string;
  otp?: string;
}

export interface UseAdminSigninReturn {
  // State
  loading: boolean;
  error: string;
  success: string;
  step: 'email' | 'otp';
  email: string;
  otp: string;
  validationErrors: ValidationErrors;

  // Actions
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  clearMessages: () => void;
  
  // Auth methods
  sendOtp: () => Promise<boolean>;
  verifyOtp: () => Promise<AdminData | null>;
  
  // Navigation
  goBackToEmail: () => void;
  
  // Validation
  validateForm: () => ValidationErrors;
}

export const useAdminSignin = (): UseAdminSigninReturn => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Clear success and error messages
   */
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
    setValidationErrors({});
  }, []);

  /**
   * Generic API call handler
   */
  const handleApiCall = useCallback(async (
    apiCall: () => Promise<ApiResponse>,
    successMessage?: string
  ): Promise<boolean> => {
    clearMessages();
    setLoading(true);

    // Cancel previous request
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
      
      console.error('Admin auth API call error:', error);
      const errorMessage = 'Network error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  /**
   * Validate current form data
   */
  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (step === 'email') {
      const emailError = validateEmail(email);
      if (emailError) errors.email = emailError;
    } else if (step === 'otp') {
      const emailError = validateEmail(email);
      const otpError = validateOtp(otp);
      
      if (emailError) errors.email = emailError;
      if (otpError) errors.otp = otpError;
    }

    setValidationErrors(errors);
    return errors;
  }, [step, email, otp]);

  /**
   * Send OTP to admin email
   */
  const sendOtp = useCallback(async (): Promise<boolean> => {
    // Validate email first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors');
      return false;
    }

    const success = await handleApiCall(
      () => sendAdminOtp(email, abortControllerRef.current?.signal),
      'OTP sent successfully! Check your email.'
    );

    if (success) {
      setStep('otp');
    }

    return success;
  }, [email, validateForm, handleApiCall]);

  /**
   * Verify OTP and authenticate
   */
  const verifyOtp = useCallback(async (): Promise<AdminData | null> => {
    // Validate form first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors');
      return null;
    }

    clearMessages();
    setLoading(true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await verifyAdminOtp(
        email, 
        otp, 
        abortControllerRef.current?.signal
      );
      
      if (result.success && result.data) {
        setSuccess('Login successful! Redirecting to dashboard...');
        toast.success('Login successful!');
        return result.data;
      } else {
        setError(result.message || 'Invalid OTP');
        toast.error(result.message || 'Invalid OTP');
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      
      console.error('Verify OTP error:', error);
      const errorMessage = 'Network error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [email, otp, validateForm, clearMessages]);

  /**
   * Go back to email step
   */
  const goBackToEmail = useCallback(() => {
    setStep('email');
    setOtp('');
    clearMessages();
  }, [clearMessages]);

  /**
   * Auto-clear messages after 5 seconds
   */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  return {
    // State
    loading,
    error,
    success,
    step,
    email,
    otp,
    validationErrors,

    // Actions
    setEmail,
    setOtp,
    clearMessages,

    // Auth methods
    sendOtp,
    verifyOtp,
    
    // Navigation
    goBackToEmail,
    
    // Validation
    validateForm
  };
};