export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface SignupOtpRequest {
  email: string;
  isSignup: boolean;
}

export interface SignupOtpValidationRequest {
  email: string;
  otp: string;
}

export const sendSignupOtp = async (
  email: string, 
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, isSignup: true }),
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
      message: "OTP sent to your email!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Send signup OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

export const createUser = async (
  userData: SignupRequest,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || undefined,
        address: userData.address || undefined,
      }),
      signal
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create account"
      };
    }

    return {
      success: true,
      message: "Account created successfully"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Create user error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

export const verifySignupOtp = async (
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
      message: "Account created successfully!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Verify signup OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};


export const completeSignup = async (
  userData: SignupRequest,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const createResult = await createUser(userData, signal);
    if (!createResult.success) {
      return createResult;
    }

    const verifyResult = await verifySignupOtp(userData.email, otp, signal);
    if (!verifyResult.success) {
      return verifyResult;
    }

    return {
      success: true,
      message: "Account created successfully!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Complete signup error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

export const resendSignupOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const result = await sendSignupOtp(email, signal);
    
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