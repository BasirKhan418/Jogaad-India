export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  img?: string;
}

export interface UploadResponse {
  uploadURL: string;
  fileURL: string;
  filename: string;
}

export const getUploadUrl = async (
  filename: string,
  contentType: string,
  signal?: AbortSignal
): Promise<ApiResponse<UploadResponse>> => {
  try {
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        contentType,
      }),
      signal
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || 'Failed to get upload URL'
      };
    }

    return {
      success: true,
      data: {
        uploadURL: data.uploadURL,
        fileURL: data.fileURL,
        filename: data.filename
      }
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Get upload URL error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const uploadFileToS3 = async (
  uploadURL: string,
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch(uploadURL, {
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
        message: 'Failed to upload file'
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
    
    console.error('Upload file error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const uploadProfileImage = async (
  file: File,
  signal?: AbortSignal
): Promise<ApiResponse<string>> => {
  try {
    const urlResult = await getUploadUrl(file.name, file.type, signal);
    if (!urlResult.success || !urlResult.data) {
      return {
        success: false,
        message: urlResult.message || 'Failed to get upload URL'
      };
    }

    const uploadResult = await uploadFileToS3(urlResult.data.uploadURL, file, signal);
    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message || 'Failed to upload file'
      };
    }

    return {
      success: true,
      data: urlResult.data.fileURL,
      message: 'Image uploaded successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Upload profile image error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const updateProfile = async (
  email: string,
  profileData: ProfileUpdateRequest,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/v1/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ...profileData
      }),
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to update profile'
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Update profile error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }

 
  const maxSize = 5 * 1024 * 1024; 
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
};