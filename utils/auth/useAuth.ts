
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  fetchUserAuth, 
  shouldAllowAuthCall, 
  clearAuthCache,
  AuthUser, 
  AuthState 
} from './authService';

export interface UseAuthReturn extends AuthState {
  refreshAuth: (force?: boolean) => Promise<void>;
  logout: () => void;
}


export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchTimeRef = useRef(0); 
  const isMountedRef = useRef(true);
  const requestInProgressRef = useRef(false); 
  const abortControllerRef = useRef<AbortController | null>(null); 

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const resetAuthState = useCallback(() => {
    if (!isMountedRef.current) return;
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshAuth = useCallback(async (force = false) => {
    if (!isMountedRef.current) return; 
    
    if (requestInProgressRef.current) return;
    
    if (!force && !shouldAllowAuthCall(lastFetchTimeRef.current)) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    lastFetchTimeRef.current = Date.now(); 
    requestInProgressRef.current = true; 

    try {
      const authData = await fetchUserAuth(!force, abortControllerRef.current.signal); 
      if (!isMountedRef.current) return;
      
      if (authData.success && authData.data) {
        setIsAuthenticated(true);
        setUser(authData.data);
      } else {
        resetAuthState();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      console.error('Auth refresh error:', error);
      if (isMountedRef.current) {
        resetAuthState();
      }
    } finally {
      requestInProgressRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []); 

  const logout = useCallback(() => {
    resetAuthState();
    clearAuthCache(); 
    setLoading(false);
  }, [resetAuthState]);


  useEffect(() => {
    refreshAuth(true); 
    
    const interval = setInterval(() => refreshAuth(true), 30000); 
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (!document.hidden || document.hasFocus()) {
        refreshAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return {
    isAuthenticated,
    user,
    loading,
    refreshAuth,
    logout
  };
};