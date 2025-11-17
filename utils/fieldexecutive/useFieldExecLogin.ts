
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  sendFieldExecLoginOtp, 
  validateFieldExecLoginOtp, 
  resendFieldExecLoginOtp,
  ApiResponse 
} from './fieldExecAuthService';
import { toast } from 'sonner';

export type FieldExecLoginStep = 'email' | 'otp';

export interface UseFieldExecLoginReturn {
  step: FieldExecLoginStep;
  loading: boolean;
  error: string;
  success: string;
  email: string;
  otp: string;
  
  setStep: (step: FieldExecLoginStep) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  clearMessages: () => void;
  handleSendOtp: (email: string) => Promise<boolean>;
  handleValidateOtp: (email: string, otp: string) => Promise<boolean>;
  handleResendOtp: (email: string) => Promise<boolean>;
  resetForm: () => void;
}


export const useFieldExecLogin = (): UseFieldExecLoginReturn => {
  // State management
  const [step, setStep] = useState<FieldExecLoginStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
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

  
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const resetForm = useCallback(() => {
    setStep('email');
    setEmail('');
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

    // Cancel any pending requests
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
      // Don't show error for aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const handleSendOtp = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      const errorMsg = 'Please enter your email address';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    const success = await handleApiCall(
      () => sendFieldExecLoginOtp(email, abortControllerRef.current?.signal),
      'OTP sent successfully to your email!'
    );

    if (success) {
      setStep('otp');
    }

    return success;
  }, [handleApiCall]);

 
  const handleValidateOtp = useCallback(async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    if (!otp || otp.trim().length !== 6) {
      const errorMsg = 'Please enter a valid 6-digit OTP';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    const success = await handleApiCall(
      () => validateFieldExecLoginOtp(email, otp, abortControllerRef.current?.signal),
      'Login successful! Redirecting...'
    );

    if (success) {
      // Redirect to field executive dashboard
      setTimeout(() => {
        window.location.href = '/field-executive/dashboard';
      }, 1000);
    }

    return success;
  }, [handleApiCall]);


  const handleResendOtp = useCallback(async (email: string): Promise<boolean> => {
    return await handleApiCall(
      () => resendFieldExecLoginOtp(email, abortControllerRef.current?.signal),
      'OTP resent successfully!'
    );
  }, [handleApiCall]);

  return {
    step,
    loading,
    error,
    success,
    email,
    otp,
    setStep,
    setEmail,
    setOtp,
    clearMessages,
    handleSendOtp,
    handleValidateOtp,
    handleResendOtp,
    resetForm
  };
};
