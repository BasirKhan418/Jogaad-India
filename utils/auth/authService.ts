export interface AuthUser {
  name: string;
  email: string;
  id?: string;
  img?: string;
  phone?: string;
  address?: string;
  type?: 'admin' | 'user' | 'employee' | 'field-exec';
  isSuperAdmin?: boolean;
  [key: string]: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthUser;
  message?: string;
}


const authCache = {
  data: null as AuthUser | null,
  timestamp: 0,
  ttl: 2 * 60 * 1000, 
  hasValidData: false, 
  isValid() {
    return this.hasValidData && (Date.now() - this.timestamp) < this.ttl;
  },
  set(data: AuthUser | null) {
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

export const fetchUserAuth = async (useCache = true, signal?: AbortSignal): Promise<AuthResponse> => {
  if (useCache && authCache.isValid()) {
    return {
      success: true,
      data: authCache.data ?? undefined 
    };
  }

  try {
    const response = await fetch("/api/v1/getdata", {
      cache: 'no-store',
      credentials: 'include',
      signal 
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      authCache.set(data.data); 
      return {
        success: true,
        data: data.data
      };
    } else {
      authCache.clear();
      return {
        success: false,
        message: data.message || 'Authentication failed'
      };
    }
  } catch (error) {
    console.error('Auth fetch error:', error);
    authCache.clear(); 
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};


export const shouldAllowAuthCall = (
  lastCallTime: number, 
  debounceMs: number = 5000
): boolean => {
  const now = Date.now();
  return now - lastCallTime >= debounceMs;
};


export const clearAuthCache = () => {
  authCache.clear();
};


export const getUserInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'U'; 
  }
  
  return name
    .trim()
    .split(" ")
    .filter(word => word.length > 0) 
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};