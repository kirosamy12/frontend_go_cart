import { useEffect, useState, useCallback } from "react";

export const useAdminTopStores = () => {
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
      
      // Fetch admin dashboard data which contains store revenues
      console.log("useAdminTopStores: Fetching admin dashboard data with token");
      console.log("useAdminTopStores: API endpoint", 'https://go-cart-1bwm.vercel.app/api/admin/dashboard');
      console.log("useAdminTopStores: Token available:", !!token);
      
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
        headers: {
          'token': token
        }
      });
      
      console.log("useAdminTopStores: Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("useAdminTopStores: Parsed response", result);
      
      if (result.success) {
        // Transform the storeRevenues data to match the chart format
        const transformedData = (result.data.storeRevenues || []).map(store => ({
          name: store.storeName,
          value: store.revenue || 0
        }));
        setData(transformedData);
      } else {
        throw new Error(result.message || "Failed to fetch top stores data");
      }
    } catch (err) {
      const errorMessage = err.message || "Error loading top stores data";
      console.error("useAdminTopStores: Error", errorMessage, err);
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