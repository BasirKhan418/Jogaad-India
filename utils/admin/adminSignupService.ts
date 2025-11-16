export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AdminSignupRequest {
  name: string;
  email: string;
  phone?: string;
  img?: string;
  password: string; // ADMIN_CREATE_CREDENTIAL
}

export interface AdminSignupOtpRequest {
  email: string;
}

export interface AdminSignupOtpValidationRequest {
  email: string;
  otp: string;
}

/**
 * Send OTP for admin signup
 */
export const sendAdminSignupOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/admin/signin", {
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
      message: "OTP sent to your email!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Send admin signup OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

/**
 * Create admin account
 */
export const createAdmin = async (
  adminData: AdminSignupRequest,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone || undefined,
        img: adminData.img || undefined,
        password: adminData.password,
      }),
      signal
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create admin account"
      };
    }

    return {
      success: true,
      message: "Admin account created successfully"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Create admin error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

/**
 * Verify OTP and complete admin signup
 */
export const verifyAdminSignupOtp = async (
  email: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/admin/signin/validate", {
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
      message: "Admin account verified successfully!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Verify admin signup OTP error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

/**
 * Complete admin signup (create account + verify OTP)
 */
export const completeAdminSignup = async (
  adminData: AdminSignupRequest,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const createResult = await createAdmin(adminData, signal);
    if (!createResult.success) {
      return createResult;
    }

    const verifyResult = await verifyAdminSignupOtp(adminData.email, otp, signal);
    if (!verifyResult.success) {
      return verifyResult;
    }

    return {
      success: true,
      message: "Admin account created successfully!"
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Complete admin signup error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

/**
 * Resend OTP for admin signup
 */
export const resendAdminSignupOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const result = await sendAdminSignupOtp(email, signal);
    
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

/**
 * Upload image to S3 and get URL
 */
export const uploadImage = async (
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse<{ fileURL: string }>> => {
  try {
    // Get presigned URL
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
      signal
    });

    const data = await response.json();

    if (!data.uploadURL || !data.fileURL) {
      return {
        success: false,
        message: 'Failed to get upload URL'
      };
    }

    // Upload file to S3
    const uploadResponse = await fetch(data.uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      signal
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: 'Failed to upload image'
      };
    }

    return {
      success: true,
      data: { fileURL: data.fileURL },
      message: 'Image uploaded successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Upload image error:', error);
    return {
      success: false,
      message: 'Failed to upload image'
    };
  }
};
