import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

export const useAdminRecentActivity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch admin recent activity data from the specific endpoint
      const response = await api.get('/admin/recent-activity');
      
      const result = response.data;
      
      if (result.success) {
        // Transform the data to match the dashboard format
        const transformedData = result.data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          timestamp: new Date(item.timestamp),
          type: item.type,
          value: item.value
        }));
        setData(transformedData);
      } else {
        throw new Error(result.error || "Failed to fetch recent activity data");
      }
    } catch (err) {
      const errorMessage = err.message || "Error loading recent activity data";
      console.error("useAdminRecentActivity: Error", errorMessage, err);
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