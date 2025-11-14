import { useEffect, useState, useCallback } from "react";

export const useAdminOrderVolume = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Fetch admin dashboard data which contains recent sales data
      console.log("useAdminOrderVolume: Fetching admin dashboard data with token");
      console.log("useAdminOrderVolume: API endpoint", 'https://go-cart-1bwm.vercel.app/api/admin/dashboard');
      console.log("useAdminOrderVolume: Token available:", !!token);
      
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
        headers: {
          'token': token
        }
      });
      
      console.log("useAdminOrderVolume: Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("useAdminOrderVolume: Parsed response", result);
      
      if (result.success) {
        // Transform the recentSales data to match the chart format
        const transformedData = (result.data.recentSales || []).map(sale => ({
          day: sale._id,
          orders: sale.orderCount || 0
        }));
        setData(transformedData);
      } else {
        throw new Error(result.message || "Failed to fetch order volume data");
      }
    } catch (err) {
      const errorMessage = err.message || "Error loading order volume data";
      console.error("useAdminOrderVolume: Error", errorMessage, err);
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