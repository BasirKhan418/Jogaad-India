export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const uploadImageToS3 = async (file: File): Promise<ApiResponse> => {
  try {
    // Step 1: Get signed URL from our API
    const urlResponse = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const urlData = await urlResponse.json();

    if (!urlData.uploadURL || !urlData.fileURL) {
      return {
        success: false,
        message: urlData.error || 'Failed to get upload URL',
      };
    }

    // Step 2: Upload file directly to S3 using signed URL
    const uploadResponse = await fetch(urlData.uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: 'Failed to upload file to S3',
      };
    }

    // Return the final file URL
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: urlData.fileURL,
      },
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      message: 'Failed to upload image',
    };
  }
};
