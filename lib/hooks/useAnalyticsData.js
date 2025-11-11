import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

export const useAnalyticsData = (role) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("useAnalyticsData: Fetching data for", { role });
      
      let response;
      if (role === "admin") {
        console.log("Calling admin analytics");
        response = await api.getAnalytics("admin");
      } else if (role === "store") {
        console.log("Calling store dashboard");
        response = await api.getAnalytics("store");
      } else {
        throw new Error("Invalid role");
      }

      console.log("useAnalyticsData: Received response", response.data);
      setData(response.data.data);
      console.log("useAnalyticsData: Set data", response.data.data);
    } catch (err) {
      // Provide more detailed error information
      let errorMessage = "Error loading dashboard data";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || 
                      `Server error ${err.response.status}: ${err.response.statusText}` || 
                      errorMessage;
      } else if (err.request) {
        // Network error
        errorMessage = "Network error - Check your internet connection or API server availability";
      } else {
        // Other error
        errorMessage = err.message || errorMessage;
      }
      
      console.error("useAnalyticsData: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    // Only fetch if we have the required data
    if (role === "admin") {
      fetchData();
    } else if (role === "store") {
      fetchData();
    }
  }, [fetchData, role]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useSalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSalesAnalytics();
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading sales analytics data";
      console.error("useSalesAnalytics: Error", errorMessage, err);
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

export const updateAnalytics = async () => {
  try {
    const response = await api.updateAnalytics();
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Error updating analytics data";
    console.error("updateAnalytics: Error", errorMessage, err);
    throw new Error(errorMessage);
  }
};