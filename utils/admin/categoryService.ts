export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  categoryType: 'Service' | 'Maintenance';
  categoryDescription?: string;
  categoryUnit?: string;
  recommendationPrice: number;
  categoryMinPrice?: number;
  categoryMaxPrice?: number;
  categoryStatus: boolean;
  img?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  total: number;
  service: number;
  maintenance: number;
}

/**
 * Fetch all categories
 */
export const fetchAllCategories = async (
  signal?: AbortSignal
): Promise<ApiResponse<{ categories: Category[] }>> => {
  try {
    const response = await fetch('/api/v1/admincategory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to fetch categories'
      };
    }

    return {
      success: true,
      data: { categories: data.categories || [] },
      message: 'Categories fetched successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Fetch categories error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

/**
 * Fetch categories by type
 */
export const fetchCategoriesByType = async (
  type: 'Service' | 'Maintenance',
  signal?: AbortSignal
): Promise<ApiResponse<{ categories: Category[] }>> => {
  try {
    const response = await fetch(`/api/v1/admincategory?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || `Failed to fetch ${type} categories`
      };
    }

    return {
      success: true,
      data: { categories: data.categories || [] },
      message: `${type} categories fetched successfully`
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error(`Fetch ${type} categories error:`, error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};

/**
 * Calculate category statistics
 */
export const calculateCategoryStats = (categories: Category[]): CategoryStats => {
  const stats: CategoryStats = {
    total: categories.length,
    service: 0,
    maintenance: 0
  };

  categories.forEach(cat => {
    if (cat.categoryType === 'Service') {
      stats.service++;
    } else if (cat.categoryType === 'Maintenance') {
      stats.maintenance++;
    }
  });

  return stats;
};

/**
 * Delete a category
 */
export const deleteCategory = async (
  categoryId: string,
  signal?: AbortSignal
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/api/v1/admincategory?id=${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to delete category'
      };
    }

    return {
      success: true,
      message: 'Category deleted successfully'
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('Delete category error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.'
    };
  }
};
