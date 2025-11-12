export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface SigninRequest {
  email: string;
}

export interface OtpValidationRequest {
  email: string;
  otp: string;
}

export const sendOtp = async (
  email: string, 
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      signal
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to send OTP"
      };
    }

    return {
      success: true,
      message: "OTP sent successfully"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

export const validateOtp = async (
  email: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/user/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      signal
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Invalid OTP"
      };
    }

    return {
      success: true,
      message: "Login successful"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Validate OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

export const resendOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const result = await sendOtp(email, signal);
    
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
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};