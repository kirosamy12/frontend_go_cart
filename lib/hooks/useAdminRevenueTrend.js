import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

export const useAdminRevenueTrend = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch admin revenue trend data from the specific endpoint
      const response = await api.get('/admin/revenue-trend');
      
      const result = response.data;
      
      if (result.success) {
        // Transform the data to match the chart format
        const transformedData = result.data.map(item => ({
          date: item.period,
          revenue: item.revenue,
          orders: item.orderCount
        }));
        setData(transformedData);
      } else {
        throw new Error(result.error || "Failed to fetch revenue trend data");
      }
    } catch (err) {
      const errorMessage = err.message || "Error loading revenue trend data";
      console.error("useAdminRevenueTrend: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};