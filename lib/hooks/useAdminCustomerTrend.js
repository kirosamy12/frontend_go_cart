import { useEffect, useState, useCallback } from "react";

export const useAdminCustomerTrend = () => {
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
      
      // Fetch admin dashboard data
      console.log("useAdminCustomerTrend: Fetching admin dashboard data with token");
      console.log("useAdminCustomerTrend: API endpoint", 'https://go-cart-1bwm.vercel.app/api/admin/dashboard');
      console.log("useAdminCustomerTrend: Token available:", !!token);
      
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
        headers: {
          'token': token
        }
      });
      
      console.log("useAdminCustomerTrend: Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("useAdminCustomerTrend: Parsed response", result);
      
      if (result.success) {
        // For now, we'll create mock customer trend data based on the available data
        // In a real implementation, this would come from the API
        const mockData = [
          {
            date: "2025-10",
            customers: result.data.totalUsers ? Math.floor(result.data.totalUsers * 0.3) : 45
          },
          {
            date: "2025-11",
            customers: result.data.totalUsers ? Math.floor(result.data.totalUsers * 0.7) : 62
          }
        ];
        setData(mockData);
      } else {
        throw new Error(result.message || "Failed to fetch customer trend data");
      }
    } catch (err) {
      const errorMessage = err.message || "Error loading customer trend data";
      console.error("useAdminCustomerTrend: Error", errorMessage, err);
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