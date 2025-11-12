import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  uploadProfileImage, 
  updateProfile, 
  validateImageFile,
  ProfileUpdateRequest, 
  ApiResponse 
} from './profileService';

const PHONE_REGEX = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
const MIN_NAME_LENGTH = 2;

const validateName = (name: string): string | undefined => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < MIN_NAME_LENGTH) return `Name must be at least ${MIN_NAME_LENGTH} characters`;
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (phone && phone.trim()) {
    if (!PHONE_REGEX.test(phone.trim().replace(/\s+/g, ''))) {
      return 'Please enter a valid phone number';
    }
  }
  return undefined;
};

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  isImposedFine: boolean;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export interface UseProfileReturn {
  loading: boolean;
  uploading: boolean;
  error: string;
  success: string;
  isEditing: boolean;
  profileData: ProfileUpdateRequest;
  validationErrors: ValidationErrors;

  setIsEditing: (editing: boolean) => void;
  setProfileData: (data: ProfileUpdateRequest) => void;
  clearMessages: () => void;

  updateUserProfile: (userData: UserData) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
  validateImage: (file: File) => string | null;
  validateProfile: (data: ProfileUpdateRequest) => ValidationErrors;

  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  resetProfileData: (userData: UserData) => void;
  cancelEdit: (userData: UserData) => void;
}

export const useProfile = (): UseProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileUpdateRequest>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);


  const handleApiCall = useCallback(async (
    apiCall: () => Promise<ApiResponse>,
    successMessage?: string
  ): Promise<boolean> => {
    clearMessages();
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await apiCall();
      
      if (result.success) {
        if (successMessage) {
          setSuccess(successMessage);
          toast.success(successMessage);
        }
        return true;
      } else {
        setError(result.message || 'An error occurred');
        toast.error(result.message || 'An error occurred');
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      console.error('Profile API call error:', error);
      const errorMessage = 'Network error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const updateUserProfile = useCallback(async (userData: UserData): Promise<boolean> => {
    if (loading) return false;

    const dataToUpdate = {
      name: profileData.name || userData.name,
      phone: profileData.phone ?? userData.phone,
      address: profileData.address ?? userData.address,
      img: profileData.img || userData.img
    };

    if (!dataToUpdate.name?.trim()) {
      setError('Name is required');
      return false;
    }

    const success = await handleApiCall(
      () => updateProfile(userData.email, dataToUpdate, abortControllerRef.current?.signal),
      'Profile updated successfully!'
    );

    if (success) {
      setIsEditing(false);
    }

    return success;
  }, [profileData, handleApiCall]); 


  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return null;
    }

    clearMessages();
    setUploading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await uploadProfileImage(file, abortControllerRef.current.signal);
      
      if (result.success && result.data) {
        toast.success('Image uploaded successfully!');
        return result.data;
      } else {
        setError(result.message || 'Failed to upload image');
        toast.error(result.message || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      
      console.error('Upload image error:', error);
      const errorMessage = 'Failed to upload image. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  }, [clearMessages]);

  
  const validateImage = useCallback((file: File): string | null => {
    return validateImageFile(file);
  }, []);

 
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const errors: ValidationErrors = {};
    
    if (name === 'name') {
      const nameError = validateName(value);
      if (nameError) errors.name = nameError;
    } else if (name === 'phone') {
      const phoneError = validatePhone(value);
      if (phoneError) errors.phone = phoneError;
    }
    
    setValidationErrors(prev => {
      const updated = { ...prev };
      
      if (Object.keys(errors).length > 0) {
        Object.assign(updated, errors);
      } else {
        delete updated[name as keyof ValidationErrors];
      }
      
      return updated;
    });
    
    if (error) {
      setError('');
    }
  }, [error]); 

 
  const resetProfileData = useCallback((userData: UserData) => {
    setProfileData({
      name: userData.name,
      phone: userData.phone || '',
      address: userData.address || '',
      img: userData.img
    });
    setValidationErrors({}); 
    clearMessages();
  }, [clearMessages]);

  const cancelEdit = useCallback((userData: UserData) => {
    setIsEditing(false);
    resetProfileData(userData);
  }, [resetProfileData]);

  const validateProfile = useCallback((data: ProfileUpdateRequest): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (data.name !== undefined) {
      const nameError = validateName(data.name);
      if (nameError) errors.name = nameError;
    }

    if (data.phone !== undefined) {
      const phoneError = validatePhone(data.phone);
      if (phoneError) errors.phone = phoneError;
    }

    setValidationErrors(errors);
    return errors;
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  return {
    loading,
    uploading,
    error,
    success,
    isEditing,
    profileData,
    validationErrors,

    setIsEditing,
    setProfileData,
    clearMessages,

    updateUserProfile,
    uploadImage,
    validateImage,
    validateProfile,

    handleInputChange,
    resetProfileData,
    cancelEdit
  };
};