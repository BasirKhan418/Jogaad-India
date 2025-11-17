import { ApiResponse } from './adminApiService';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  employees: {
    total: number;
    active: number;
    inactive: number;
    paid: number;
    pending: number;
  };
  fieldExecutives: {
    total: number;
    active: number;
    inactive: number;
  };
  categories: {
    total: number;
    service: number;
    maintenance: number;
  };
  fees: {
    userFee: number;
    employeeFee: number;
  };
}

/**
 * Fetch dashboard statistics
 */
export const fetchDashboardStats = async (signal?: AbortSignal): Promise<ApiResponse<DashboardStats>> => {
  try {
    const [
      employeesResponse,
      fieldExecutivesResponse,
      categoriesResponse,
      feesResponse
    ] = await Promise.all([
      fetch('/api/v1/employees', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal 
      }),
      fetch('/api/v1/manage-field-e', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal 
      }),
      fetch('/api/v1/admincategory', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal 
      }),
      fetch('/api/v1/fees', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal 
      })
    ]);

    const [employeesData, fieldExecutivesData, categoriesData, feesData] = await Promise.all([
      employeesResponse.json(),
      fieldExecutivesResponse.json(),
      categoriesResponse.json(),
      feesResponse.json()
    ]);

    // Calculate employee stats
    const employees = employeesData.employees || [];
    const employeeStats = {
      total: employees.length,
      active: employees.filter((emp: any) => emp.isActive).length,
      inactive: employees.filter((emp: any) => !emp.isActive).length,
      paid: employees.filter((emp: any) => emp.isPaid).length,
      pending: employees.filter((emp: any) => !emp.isPaid).length,
    };

    // Calculate field executive stats
    const fieldExecutives = fieldExecutivesData.data || [];
    const fieldExecutiveStats = {
      total: fieldExecutives.length,
      active: fieldExecutives.filter((fe: any) => fe.isActive).length,
      inactive: fieldExecutives.filter((fe: any) => !fe.isActive).length,
    };

    // Calculate category stats
    const categories = categoriesData.categories || [];
    const categoryStats = {
      total: categories.length,
      service: categories.filter((cat: any) => cat.categoryType === 'Service').length,
      maintenance: categories.filter((cat: any) => cat.categoryType === 'Maintenance').length,
    };

    // Get fees data
    const fees = feesData.fees || {};
    const feeStats = {
      userFee: fees.userFee || 0,
      employeeFee: fees.employeeFee || 0,
    };

    const dashboardStats: DashboardStats = {
      users: {
        total: 0, // Placeholder - implement user stats when needed
        active: 0,
      },
      employees: employeeStats,
      fieldExecutives: fieldExecutiveStats,
      categories: categoryStats,
      fees: feeStats,
    };

    return {
      success: true,
      data: dashboardStats,
      message: 'Dashboard stats fetched successfully'
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Fetch dashboard stats error:', error);
    return {
      success: false,
      message: 'Failed to fetch dashboard statistics'
    };
  }
};