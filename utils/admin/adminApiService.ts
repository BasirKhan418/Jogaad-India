import { CategoryInput } from '@/validator/admin/category';
import { FeesInput } from '@/validator/admin/fees';


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
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  cache?: RequestCache;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  type?: string;
  status?: boolean;
}

export interface CategoryData {
  _id?: string;
  categoryName: string;
  categoryType: 'Service' | 'Maintenance';
  categoryDescription?: string;
  categoryUnit?: string;
  recommendationPrice: number;
  categoryMinPrice?: number;
  categoryMaxPrice?: number;
  categoryStatus: boolean;
  img?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeesData {
  _id?: string;
  userOneTimeFee: number;
  employeeOneTimeFee: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadURL: string;
  fileURL: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  img?: string;
}

interface CacheItem<T> {
  data: T | null;
  timestamp: number;
  ttl: number;
  hasValidData: boolean;
  isValid(): boolean;
  set(data: T | null): void;
  clear(): void;
}

function createCache<T>(ttl: number = 5 * 60 * 1000): CacheItem<T> {
  return {
    data: null,
    timestamp: 0,
    ttl,
    hasValidData: false,
    isValid() {
      return this.hasValidData && (Date.now() - this.timestamp) < this.ttl;
    },
    set(data: T | null) {
      this.data = data;
      this.timestamp = Date.now();
      this.hasValidData = true;
    },
    clear() {
      this.data = null;
      this.timestamp = 0;
      this.hasValidData = false;
    }
  };
}

const categoriesCache = createCache<CategoryData[]>(5 * 60 * 1000); 
const feesCache = createCache<FeesData>(10 * 60 * 1000); 


const createTimeout = (timeoutMs: number = 30000): AbortController => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Clear timeout when controller is aborted from other sources
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
  });
  
  return controller;
};


const combineSignals = (...signals: (AbortSignal | undefined)[]): AbortSignal => {
  const controller = new AbortController();
  const listeners: Array<{ signal: AbortSignal; listener: () => void }> = [];
  
  signals.forEach(signal => {
    if (signal?.aborted) {
      controller.abort();
      return;
    }
    
    if (signal) {
      const listener = () => {
        controller.abort();
        listeners.forEach(({ signal: s, listener: l }) => {
          s.removeEventListener('abort', l);
        });
      };
      
      signal.addEventListener('abort', listener);
      listeners.push({ signal, listener });
    }
  });
  
  controller.signal.addEventListener('abort', () => {
    listeners.forEach(({ signal, listener }) => {
      signal.removeEventListener('abort', listener);
    });
  });
  
  return controller.signal;
};

const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '') 
    .replace(/on\w+=/gi, ''); 
};


const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    Object.entries(input).forEach(([key, value]) => {
      sanitized[sanitizeString(key)] = sanitizeInput(value);
    });
    return sanitized;
  }
  
  return input;
};


export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    signal,
    cache = 'no-store'
  } = options;

  try {
    const timeoutController = createTimeout(30000);
    const combinedSignal = combineSignals(signal, timeoutController.signal);

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: combinedSignal,
      cache,
      credentials: 'include'
    };

    if (body && method !== 'GET') {
      const sanitizedBody = sanitizeInput(body);
      config.body = typeof sanitizedBody === 'string' ? sanitizedBody : JSON.stringify(sanitizedBody);
    }

    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
      }
      
      return {
        success: false,
        message: errorMessage,
        error: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

    const data = await response.json();

    return {
      success: data.success || false,
      data: data.data,
      message: data.message,
      error: data.error
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      error: {
        details: error,
        code: 'NETWORK_ERROR'
      }
    };
  }
};


export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};


export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};


export const createCategory = async (
  categoryData: CategoryInput,
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData>> => {
  const result = await apiRequest<CategoryData>('/api/v1/admincategory', {
    method: 'POST',
    body: categoryData,
    signal
  });
  
  if (result.success) {
    categoriesCache.clear();
  }
  
  return result;
};

export const updateCategory = async (
  categoryId: string,
  updateData: Partial<CategoryInput>,
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData>> => {
  if (!categoryId.trim()) {
    return {
      success: false,
      message: 'Category ID is required'
    };
  }

  const result = await apiRequest<CategoryData>(`/api/v1/admincategory/${categoryId}`, {
    method: 'PUT',
    body: updateData,
    signal
  });
  
  // Only clear cache if successful
  if (result.success) {
    categoriesCache.clear();
  }
  
  return result;
};

export const deleteCategory = async (
  categoryId: string,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  if (!categoryId.trim()) {
    return {
      success: false,
      message: 'Category ID is required'
    };
  }

  const result = await apiRequest<void>(`/api/v1/admincategory/${categoryId}`, {
    method: 'DELETE',
    signal
  });
  
  // Only clear cache if successful
  if (result.success) {
    categoriesCache.clear();
  }
  
  return result;
};


export const getAllCategories = async (
  params?: PaginationParams & SearchParams,
  useCache: boolean = true,
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData[]>> => {
  if (useCache && !params && categoriesCache.isValid()) {
    return {
      success: true,
      data: categoriesCache.data ?? undefined,
      message: 'Categories fetched from cache'
    };
  }

  const queryString = params ? buildQueryString(params) : '';
  const endpoint = `/api/v1/admincategory${queryString ? `?${queryString}` : ''}`;
  
  const result = await apiRequest<CategoryData[]>(endpoint, {
    method: 'GET',
    signal
  });

  if (result.success && result.data && !params) {
    categoriesCache.set(result.data);
  }

  return result;
};


export const getCategoriesByType = async (
  categoryType: 'Service' | 'Maintenance',
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData[]>> => {
  return apiRequest<CategoryData[]>(`/api/v1/admincategory/type/${categoryType}`, {
    method: 'GET',
    signal
  });
};


export const getCategoryById = async (
  categoryId: string,
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData>> => {
  if (!categoryId.trim()) {
    return {
      success: false,
      message: 'Category ID is required'
    };
  }

  return apiRequest<CategoryData>(`/api/v1/admincategory/${categoryId}`, {
    method: 'GET',
    signal
  });
};

export const searchCategories = async (
  searchQuery: string,
  signal?: AbortSignal
): Promise<ApiResponse<CategoryData[]>> => {
  if (!searchQuery.trim()) {
    return {
      success: false,
      message: 'Search query is required'
    };
  }

  const queryString = buildQueryString({ query: searchQuery });
  
  return apiRequest<CategoryData[]>(`/api/v1/admincategory/search?${queryString}`, {
    method: 'GET',
    signal
  });
};


export const getUploadUrl = async (
  request: UploadUrlRequest,
  signal?: AbortSignal
): Promise<ApiResponse<UploadUrlResponse>> => {
  const validation = validateRequiredFields(request, ['filename', 'contentType']);
  
  if (!validation.isValid) {
    return {
      success: false,
      message: `Missing required fields: ${validation.missingFields.join(', ')}`
    };
  }

  return apiRequest<UploadUrlResponse>('/api/v1/upload', {
    method: 'POST',
    body: request,
    signal
  });
};


export const uploadFileToS3 = async (
  uploadUrl: string,
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      signal
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Upload failed with status: ${response.status}`
      };
    }

    return {
      success: true,
      message: 'File uploaded successfully'
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('File upload error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
      error: {
        details: error,
        code: 'UPLOAD_ERROR'
      }
    };
  }
};


export const uploadFile = async (
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse<{ fileUrl: string }>> => {
  try {
    if (!file) {
      return {
        success: false,
        message: 'No file provided'
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size should be less than 5MB'
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Please select a valid image file'
      };
    }

    const urlResult = await getUploadUrl({
      filename: file.name,
      contentType: file.type
    }, signal);

    if (!urlResult.success || !urlResult.data) {
      return {
        success: false,
        message: urlResult.message || 'Failed to get upload URL'
      };
    }

    const uploadResult = await uploadFileToS3(
      urlResult.data.uploadURL,
      file,
      signal
    );

    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message || 'File upload failed'
      };
    }

    return {
      success: true,
      data: { fileUrl: urlResult.data.fileURL },
      message: 'File uploaded successfully'
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Complete upload process error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload process failed',
      error: {
        details: error,
        code: 'UPLOAD_PROCESS_ERROR'
      }
    };
  }
};

export const updateAdminProfile = async (
  updateData: UpdateProfileRequest,
  signal?: AbortSignal
): Promise<ApiResponse<any>> => {
  const allowedFields = ['name', 'phone', 'img'];
  const filteredData: Record<string, any> = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (allowedFields.includes(key) && value !== undefined) {
      filteredData[key] = value;
    }
  });

  if (Object.keys(filteredData).length === 0) {
    return {
      success: false,
      message: 'No valid fields to update'
    };
  }

  return apiRequest('/api/v1/profile', {
    method: 'PUT',
    body: filteredData,
    signal
  });
};


export const createOrUpdateFees = async (
  feesData: FeesInput,
  signal?: AbortSignal
): Promise<ApiResponse<FeesData>> => {
  const validation = validateRequiredFields(feesData, ['userOneTimeFee', 'employeeOneTimeFee']);
  
  if (!validation.isValid) {
    return {
      success: false,
      message: `Missing required fields: ${validation.missingFields.join(', ')}`
    };
  }

  if (feesData.userOneTimeFee < 0 || feesData.employeeOneTimeFee < 0) {
    return {
      success: false,
      message: 'Fees cannot be negative'
    };
  }

  feesCache.clear();

  return apiRequest<FeesData>('/api/v1/fees', {
    method: 'POST',
    body: feesData,
    signal
  });
};


export const updateFees = async (
  feesId: string,
  updateData: Partial<FeesInput>,
  signal?: AbortSignal
): Promise<ApiResponse<FeesData>> => {
  if (!feesId.trim()) {
    return {
      success: false,
      message: 'Fees ID is required'
    };
  }

  if (
    (updateData.userOneTimeFee !== undefined && updateData.userOneTimeFee < 0) ||
    (updateData.employeeOneTimeFee !== undefined && updateData.employeeOneTimeFee < 0)
  ) {
    return {
      success: false,
      message: 'Fees cannot be negative'
    };
  }


  feesCache.clear();

  return apiRequest<FeesData>(`/api/v1/fees/${feesId}`, {
    method: 'PUT',
    body: updateData,
    signal
  });
};


export const getFees = async (
  useCache: boolean = true,
  signal?: AbortSignal
): Promise<ApiResponse<FeesData>> => {
  if (useCache && feesCache.isValid()) {
    return {
      success: true,
      data: feesCache.data ?? undefined,
      message: 'Fees fetched from cache'
    };
  }

  const result = await apiRequest<FeesData>('/api/v1/fees', {
    method: 'GET',
    signal
  });

  if (result.success && result.data) {
    feesCache.set(result.data);
  }

  return result;
};

export const deleteFees = async (
  feesId: string,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  if (!feesId.trim()) {
    return {
      success: false,
      message: 'Fees ID is required'
    };
  }

  feesCache.clear();

  return apiRequest<void>(`/api/v1/fees/${feesId}`, {
    method: 'DELETE',
    signal
  });
};

export const getAllFees = async (
  signal?: AbortSignal
): Promise<ApiResponse<FeesData[]>> => {
  return apiRequest<FeesData[]>('/api/v1/fees/all', {
    method: 'GET',
    signal
  });
};

export const clearAllCaches = (): void => {
  categoriesCache.clear();
  feesCache.clear();
};

export const clearCategoriesCache = (): void => {
  categoriesCache.clear();
};

export const clearFeesCache = (): void => {
  feesCache.clear();
};


export const isCategoriesCacheValid = (): boolean => {
  return categoriesCache.isValid();
};

export const isFeesCacheValid = (): boolean => {
  return feesCache.isValid();
};
