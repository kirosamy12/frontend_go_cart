import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

export const useAdminCustomerTrend = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch admin customer trend data from the specific endpoint
      const response = await api.get('/admin/customer-trend');
      
      const result = response.data;
      
      if (result.success) {
        // Transform the data to match the chart format
        const transformedData = result.data.map(item => ({
          date: item.month,
          customers: item.newCustomers
        }));
        setData(transformedData);
      } else {
        throw new Error(result.error || "Failed to fetch customer trend data");
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