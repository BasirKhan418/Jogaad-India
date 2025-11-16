/**
 * Employee Authentication Service
 * Handles all employee authentication-related API calls
 * Following DRY principle - reusable API functions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  redirect?: string;
  requiresPayment?: boolean;
}

export interface EmployeeLoginRequest {
  email: string;
}

export interface EmployeeOtpValidationRequest {
  email: string;
  otp: string;
}

/**
 * Generic API request handler for employee auth endpoints
 * @param url - API endpoint URL
 * @param body - Request body
 * @param signal - AbortSignal for request cancellation
 * @returns ApiResponse promise
 */
async function employeeAuthApiRequest<T = any>(
  url: string,
  body: any,
  signal?: AbortSignal
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Request failed",
        redirect: data.redirect,
        requiresPayment: data.requiresPayment
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
      token: data.token,
      redirect: data.redirect
    };
  } catch (error) {
    // Re-throw AbortError to handle cancellation
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Employee auth API error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
}

/**
 * Send OTP to employee email for login
 * @param email - Employee email address
 * @param signal - AbortSignal for request cancellation
 * @returns ApiResponse with success status
 */
export const sendEmployeeLoginOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  return employeeAuthApiRequest(
    "/api/v1/login-emp",
    { email },
    signal
  );
};

/**
 * Validate OTP and complete employee login
 * @param email - Employee email address
 * @param otp - 6-digit OTP code
 * @param signal - AbortSignal for request cancellation
 * @returns ApiResponse with token on success
 */
export const validateEmployeeLoginOtp = async (
  email: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  return employeeAuthApiRequest(
    "/api/v1/login-emp/validate-otp",
    { email, otp },
    signal
  );
};

/**
 * Resend OTP to employee email
 * @param email - Employee email address
 * @param signal - AbortSignal for request cancellation
 * @returns ApiResponse with success status
 */
export const resendEmployeeLoginOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  const result = await sendEmployeeLoginOtp(email, signal);
  
  if (result.success) {
    return {
      ...result,
      message: "OTP resent successfully"
    };
  }
  
  return {
    ...result,
    message: result.message || "Failed to resend OTP"
  };
};
