// Service layer for fees management API calls

export interface FeesData {
  _id?: string;
  userOneTimeFee: number;
  employeeOneTimeFee: number;
  fineFees: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeesResponse {
  message: string;
  success: boolean;
  data?: FeesData;
  fees?: FeesData;
}

/**
 * Fetch current fees configuration
 */
export const fetchFees = async (signal?: AbortSignal): Promise<FeesResponse> => {
  try {
    const response = await fetch('/api/v1/fees', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    // Check if request was aborted - multiple ways to detect this
    if (
      error.name === 'AbortError' || 
      (error instanceof DOMException && error.name === 'AbortError') ||
      (signal && signal.aborted) ||
      error.message?.includes('abort') ||
      error.message?.includes('unmount') ||
      (typeof error === 'string' && (error.toLowerCase().includes('abort') || error.toLowerCase().includes('unmount')))
    ) {
      throw error;
    }
    console.error('Error fetching fees:', error);
    return {
      message: 'Failed to fetch fees',
      success: false,
    };
  }
};

/**
 * Create new fees configuration
 */
export const createFees = async (
  feesData: Omit<FeesData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<FeesResponse> => {
  try {
    const response = await fetch('/api/v1/fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feesData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating fees:', error);
    return {
      message: 'Failed to create fees',
      success: false,
    };
  }
};

/**
 * Update existing fees configuration
 */
export const updateFees = async (
  id: string,
  feesData: Omit<FeesData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<FeesResponse> => {
  try {
    const response = await fetch('/api/v1/fees', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...feesData,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating fees:', error);
    return {
      message: 'Failed to update fees',
      success: false,
    };
  }
};
