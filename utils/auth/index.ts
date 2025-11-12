// Core auth service and hook
export * from './authService';
export * from './useAuth';

// Signin utilities
export * from './signinService';
export * from './useSignin';

// Signup utilities
export { 
  sendSignupOtp, 
  createUser, 
  verifySignupOtp, 
  completeSignup, 
  resendSignupOtp,
  type SignupRequest,
  type SignupOtpRequest,
  type SignupOtpValidationRequest
} from './signupService';
export * from './useSignup';