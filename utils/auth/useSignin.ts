import { useState, useCallback, useRef, useEffect } from 'react';
import { sendOtp, validateOtp, resendOtp, ApiResponse } from './signinService';
import { toast } from 'sonner';

export type SigninStep = 'email' | 'otp';

export interface UseSigninReturn {
  step: SigninStep;
  loading: boolean;
  error: string;
  success: string;
  email: string;
  otp: string;
  
  setStep: (step: SigninStep) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  clearMessages: () => void;
  handleSendOtp: (email: string) => Promise<boolean>;
  handleValidateOtp: (email: string, otp: string) => Promise<boolean>;
  handleResendOtp: (email: string) => Promise<boolean>;
  resetForm: () => void;
}

export const useSignin = (): UseSigninReturn => {
  const [step, setStep] = useState<SigninStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
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
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  
  const handleSendOtp = useCallback(async (emailAddress: string): Promise<boolean> => {
    const success = await handleApiCall(
      () => sendOtp(emailAddress, abortControllerRef.current?.signal),
      'OTP sent to your email!'
    );
    
    if (success) {
      setStep('otp');
    }
    
    return success;
  }, [handleApiCall]);

  const handleValidateOtp = useCallback(async (
    emailAddress: string, 
    otpCode: string
  ): Promise<boolean> => {
    const success = await handleApiCall(
      () => validateOtp(emailAddress, otpCode, abortControllerRef.current?.signal),
      'Logged in successfully!'
    );
    
    if (success) {
      window.location.href = '/';
    }
    
    return success;
  }, [handleApiCall]);

 
  const handleResendOtp = useCallback(async (emailAddress: string): Promise<boolean> => {
    return await handleApiCall(
      () => resendOtp(emailAddress, abortControllerRef.current?.signal),
      'OTP resent successfully!'
    );
  }, [handleApiCall]);


  const setEmailWithClearError = useCallback((newEmail: string) => {
    setEmail(newEmail);
    setError('');
  }, []);

  
  const setOtpWithClearError = useCallback((newOtp: string) => {
    setOtp(newOtp);
    setError('');
  }, []);

  return {
    step,
    loading,
    error,
    success,
    email,
    otp,
    
    setStep,
    setEmail: setEmailWithClearError,
    setOtp: setOtpWithClearError,
    clearMessages,
    handleSendOtp,
    handleValidateOtp,
    handleResendOtp,
    resetForm,
  };
};