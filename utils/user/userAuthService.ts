export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Fetch user profile data
 */
export const getUserData = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/v1/user/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch user data',
    };
  }
};
