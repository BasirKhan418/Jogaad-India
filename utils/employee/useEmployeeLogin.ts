/**
 * Employee Login Hook
 * Custom React hook for managing employee login flow with OTP verification
 * Follows DRY principle - reusable login logic
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  sendEmployeeLoginOtp, 
  validateEmployeeLoginOtp, 
  resendEmployeeLoginOtp,
  ApiResponse 
} from './employeeAuthService';
import { toast } from 'sonner';

export type EmployeeLoginStep = 'email' | 'otp';

export interface UseEmployeeLoginReturn {
  step: EmployeeLoginStep;
  loading: boolean;
  error: string;
  success: string;
  email: string;
  otp: string;
  
  setStep: (step: EmployeeLoginStep) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  clearMessages: () => void;
  handleSendOtp: (email: string) => Promise<boolean>;
  handleValidateOtp: (email: string, otp: string) => Promise<boolean>;
  handleResendOtp: (email: string) => Promise<boolean>;
  resetForm: () => void;
}

/**
 * Custom hook for employee login with OTP verification
 * Manages state, API calls, and user feedback
 * 
 * @returns Object containing state, handlers, and utility functions
 * 
 * @example
 * ```tsx
 * const { email, otp, loading, handleSendOtp, handleValidateOtp } = useEmployeeLogin();
 * 
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   await handleSendOtp(email);
 * };
 * ```
 */
export const useEmployeeLogin = (): UseEmployeeLoginReturn => {
  // State management
  const [step, setStep] = useState<EmployeeLoginStep>('email');
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

  /**
   * Clear success and error messages
   */
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  /**
   * Reset form to initial state
   */
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
        
        // Handle special redirect cases
        if (result.redirect) {
          if (result.requiresPayment) {
            // Account exists but needs payment
            toast.warning(errorMsg);
            setTimeout(() => {
              window.location.href = result.redirect!;
            }, 2000);
          } else {
            // No account found - redirect to signup
            toast.info(errorMsg);
            setTimeout(() => {
              window.location.href = result.redirect!;
            }, 2000);
          }
        } else {
          toast.error(errorMsg);
        }
        
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

  /**
   * Send OTP to employee email
   * @param emailAddress - Employee email address
   * @returns Promise resolving to success boolean
   */
  const handleSendOtp = useCallback(async (emailAddress: string): Promise<boolean> => {
    const success = await handleApiCall(
      () => sendEmployeeLoginOtp(emailAddress, abortControllerRef.current?.signal),
      'OTP sent to your email!'
    );
    
    if (success) {
      setStep('otp');
    }
    
    return success;
  }, [handleApiCall]);

  /**
   * Validate OTP and complete login
   * @param emailAddress - Employee email address
   * @param otpCode - 6-digit OTP code
   * @returns Promise resolving to success boolean
   */
  const handleValidateOtp = useCallback(async (
    emailAddress: string, 
    otpCode: string
  ): Promise<boolean> => {
    const success = await handleApiCall(
      () => validateEmployeeLoginOtp(emailAddress, otpCode, abortControllerRef.current?.signal),
      'Logged in successfully!'
    );
    
    if (success) {
      // Redirect to employee dashboard after successful login
      setTimeout(() => {
        window.location.href = '/employee/dashboard';
      }, 1000);
    }
    
    return success;
  }, [handleApiCall]);

  /**
   * Resend OTP to employee email
   * @param emailAddress - Employee email address
   * @returns Promise resolving to success boolean
   */
  const handleResendOtp = useCallback(async (emailAddress: string): Promise<boolean> => {
    return await handleApiCall(
      () => resendEmployeeLoginOtp(emailAddress, abortControllerRef.current?.signal),
      'OTP resent successfully!'
    );
  }, [handleApiCall]);

  /**
   * Set email and clear any existing errors
   */
  const setEmailWithClearError = useCallback((newEmail: string) => {
    setEmail(newEmail);
    setError('');
  }, []);

  /**
   * Set OTP and clear any existing errors
   */
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
