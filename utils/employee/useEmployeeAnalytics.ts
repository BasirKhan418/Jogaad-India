import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface AnalyticsData {
  totalBookings: number;
  completedBookings: number;
  completionRate: number;
  totalEarnings: number;
  totalReviews: number;
  averageRating: number;
  recentData: any[];
  pendings: number;
}

export const useEmployeeAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/v1/emp/analytics";
      
      if (dateRange.startDate && dateRange.endDate) {
        url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch analytics");
        toast.error(data.message || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    dateRange,
    setDateRange,
    refetch: fetchAnalytics
  };
};
