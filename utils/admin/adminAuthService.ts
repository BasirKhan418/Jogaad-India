export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export interface AdminLoginRequest {
  email: string;
}

export interface AdminOtpRequest {
  email: string;
  otp: string;
}

export interface AdminData {
  _id?: string;
  name: string;
  email: string;
  img?: string;
  phone?: string;
  isSuperAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export const sendAdminOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/v1/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to send OTP'
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const verifyAdminOtp = async (
  email: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse<AdminData>> => {
  try {
    const response = await fetch('/api/v1/signin/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Invalid OTP'
      };
    }

    return {
      success: true,
      data: data.data,
      message: 'Login successful'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Verify OTP error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const getAdminData = async (signal?: AbortSignal): Promise<ApiResponse<AdminData>> => {
  try {
    const response = await fetch('/api/v1/profile', {
      method: 'GET',
      credentials: 'include',
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to fetch admin data'
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Get admin data error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const logoutAdmin = async (signal?: AbortSignal): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/v1/logout', {
      method: 'POST',
      credentials: 'include',
      signal
    });

    const data = await response.json();

    return {
      success: data.success || true,
      message: data.message || 'Logged out successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Logout error:', error);
    return {
      success: true,
      message: 'Logged out (session cleared locally)'
    };
  }
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validateOtp = (otp: string): string | null => {
  if (!otp.trim()) {
    return 'OTP is required';
  }
  
  if (otp.trim().length !== 6) {
    return 'OTP must be 6 digits';
  }
  
  if (!/^\d{6}$/.test(otp.trim())) {
    return 'OTP must contain only numbers';
  }
  
  return null;
};