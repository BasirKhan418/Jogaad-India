export interface FieldExecutiveData {
  _id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  block?: string;
  isActive: boolean;
  phone: string;
  img?: string;
  target?: number;
  targetDate?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface FieldExecutiveCreateRequest {
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  block?: string;
  phone: string;
  img?: string;
  target?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const createFieldExecutiveAccount = async (
  data: FieldExecutiveCreateRequest
): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/v1/manage-field-e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred',
    };
  }
};

export const uploadImage = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  try {
    // Step 1: Get presigned URL from server
    const uploadResponse = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: 'Failed to get upload URL',
      };
    }

    const uploadData = await uploadResponse.json();

    if (!uploadData.uploadURL || !uploadData.fileURL) {
      return {
        success: false,
        message: 'Invalid upload response',
      };
    }

    // Step 2: Upload file directly to S3 using presigned URL
    const s3Response = await fetch(uploadData.uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!s3Response.ok) {
      return {
        success: false,
        message: 'Failed to upload file to storage',
      };
    }

    // Step 3: Return the file URL
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadData.fileURL,
      },
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      message: 'Failed to upload image',
    };
  }
};
