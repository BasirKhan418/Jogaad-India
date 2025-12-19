export interface AdminCreateRequest {
  name: string;
  email: string;
  phone?: string;
  img?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}


export const createAdminByAdmin = async (
  adminData: AdminCreateRequest,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
      signal,
      credentials: "include", 
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
      data: data.data,
      message: data.message || "Admin account created successfully"
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


export const uploadAdminImage = async (
  file: File
): Promise<ApiResponse<{ fileURL: string }>> => {
  try {
    // 1️⃣ Ask backend for signed URL
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || 'Failed to get upload URL',
      };
    }

    const { uploadURL, fileURL } = result.data;

    // 2️⃣ Upload file directly to S3
    const uploadRes = await fetch(uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      return {
        success: false,
        message: 'Failed to upload image to storage',
      };
    }

    return {
      success: true,
      data: { fileURL },
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Upload image error:', error);
    return {
      success: false,
      message: 'Failed to upload image',
    };
  }
};

