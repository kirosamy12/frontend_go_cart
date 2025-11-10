import { useEffect, useState, useCallback } from "react";

export const useAdminRevenueTrend = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Fetch admin revenue trend data from the specific endpoint
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/revenue-trend', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'token': token })
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
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