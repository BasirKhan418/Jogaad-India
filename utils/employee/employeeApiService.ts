export interface ApiError {
  status?: number;
  statusText?: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  order?: any;
  redirect?: boolean;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  cache?: RequestCache;
}

export interface CategoryData {
  _id: string;
  categoryName: string;
  categoryType: 'Service' | 'Maintenance';
  categoryDescription?: string;
  categoryUnit?: string;
  recommendationPrice: number;
  categoryMinPrice?: number;
  categoryMaxPrice?: number;
  categoryStatus: boolean;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCreateRequest {
  name: string;
  email: string;
  address?: string;
  phone: string;
  pincode: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  img?: string;
  categoryid: string;
  payrate: number;
  othersCategory?: string;
  description?: string;
}

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadURL: string;
  fileURL: string;
}

/**
 * Generic API request handler
 */
async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    signal,
    cache = 'no-store'
  } = options;

  try {
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers
    };

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      signal
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`,
        error: {
          status: response.status,
          statusText: response.statusText,
          details: data
        }
      };
    }

    return {
      success: data.success !== false,
      data: data.data,
      message: data.message,
      order: data.order,
      redirect: data.redirect
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('API request error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.',
      error: {
        code: 'NETWORK_ERROR',
        details: error
      }
    };
  }
}

/**
 * Fetch all categories from public API
 */
export const fetchAllCategories = async (
  signal?: AbortSignal
): Promise<ApiResponse<{ categories: CategoryData[] }>> => {
  try {
    const response = await fetch('/api/v1/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to fetch categories'
      };
    }

    return {
      success: true,
      data: { categories: data.categories || [] },
      message: 'Categories fetched successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Fetch categories error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

/**
 * Fetch categories by type from public API
 */
export const fetchCategoriesByType = async (
  type: 'Service' | 'Maintenance',
  signal?: AbortSignal
): Promise<ApiResponse<{ categories: CategoryData[] }>> => {
  try {
    const response = await fetch(`/api/v1/category?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || `Failed to fetch ${type} categories`
      };
    }

    return {
      success: true,
      data: { categories: data.categories || [] },
      message: `${type} categories fetched successfully`
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Fetch categories by type error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

/**
 * Create employee account
 */
export const createEmployeeAccount = async (
  employeeData: EmployeeCreateRequest,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await apiRequest(
      '/api/v1/create-account',
      {
        method: 'POST',
        body: employeeData,
        signal
      }
    );

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Create employee account error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

/**
 * Get presigned URL for image upload
 */
export const getUploadUrl = async (
  request: UploadUrlRequest,
  signal?: AbortSignal
): Promise<ApiResponse<UploadUrlResponse>> => {
  try {
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include',
      signal
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        message: data.error || data.message || 'Failed to get upload URL'
      };
    }

    // Handle both direct response and nested data response
    const uploadURL = data.data?.uploadURL || data.uploadURL;
    const fileURL = data.data?.fileURL || data.fileURL;

    if (!uploadURL || !fileURL) {
      console.error('Invalid upload response:', data);
      return {
        success: false,
        message: 'Invalid upload URL response format'
      };
    }

    return {
      success: true,
      data: {
        uploadURL,
        fileURL
      },
      message: 'Upload URL generated successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Get upload URL error:', error);
    return {
      success: false,
      message: 'Failed to get upload URL'
    };
  }
};

/**
 * Upload image to S3 using presigned URL
 */
export const uploadToS3 = async (
  uploadURL: string,
  file: File,
  signal?: AbortSignal
): Promise<boolean> => {
  try {
    const response = await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      },
      signal
    });

    return response.ok;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Upload to S3 error:', error);
    return false;
  }
};

/**
 * Complete image upload flow
 */
export const uploadImage = async (
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse<{ fileURL: string }>> => {
  try {
    // Get presigned URL
    const urlResponse = await getUploadUrl(
      {
        filename: file.name,
        contentType: file.type
      },
      signal
    );

    if (!urlResponse.success || !urlResponse.data) {
      return {
        success: false,
        message: urlResponse.message || 'Failed to get upload URL'
      };
    }

    // Upload to S3
    const uploadSuccess = await uploadToS3(
      urlResponse.data.uploadURL,
      file,
      signal
    );

    if (!uploadSuccess) {
      return {
        success: false,
        message: 'Failed to upload image to S3'
      };
    }

    return {
      success: true,
      data: { fileURL: urlResponse.data.fileURL },
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
