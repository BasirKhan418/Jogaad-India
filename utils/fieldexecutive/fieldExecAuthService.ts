export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export interface FieldExecutiveLoginRequest {
  email: string;
}

export interface FieldExecutiveOtpValidationRequest {
  email: string;
  otp: string;
}


async function fieldExecAuthApiRequest<T = any>(
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
        message: data.message || "Request failed"
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
      token: data.token
    };
  } catch (error) {
    // Re-throw AbortError to handle cancellation
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Field executive auth API error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
}

export const sendFieldExecLoginOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  return fieldExecAuthApiRequest(
    "/api/v1/field-e/login",
    { email },
    signal
  );
};


export const validateFieldExecLoginOtp = async (
  email: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  return fieldExecAuthApiRequest(
    "/api/v1/field-e/login/validate-otp",
    { email, otp },
    signal
  );
};

export const resendFieldExecLoginOtp = async (
  email: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  return fieldExecAuthApiRequest(
    "/api/v1/field-e/login",
    { email },
    signal
  );
};


export const getFieldExecData = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/field-e/getdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch profile data"
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('Field executive profile fetch error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};


export const verifyFieldExecToken = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/field-e/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    const data = await response.json();
    
    return {
      success: data.success || false,
      message: data.message || "Token verification failed"
    };
  } catch (error) {
    console.error('Field executive token verification error:', error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};
