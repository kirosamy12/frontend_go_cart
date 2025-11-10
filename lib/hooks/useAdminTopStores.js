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
      
      // Fetch admin top stores data from the specific endpoint
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/top-stores', {
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
        const transformedData = result.data.map(store => ({
          name: store.name,
          value: store.revenue || store.totalRevenue || store.sales || 0
        }));
        setData(transformedData);
      } else {
        throw new Error(result.error || "Failed to fetch top stores data");
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