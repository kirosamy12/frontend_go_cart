import { useEffect, useState, useCallback } from "react";
import api from "../api";

export const useSuccessfulOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("useSuccessfulOrders: Fetching successful orders data");
      
      // Use the new endpoint for successful orders
      const response = await api.get('/store/orders/successful');
      
      console.log("useSuccessfulOrders: Received response", response.data);
      setData(response.data);
    } catch (err) {
      // Provide more detailed error information
      let errorMessage = "Error loading successful orders data";
      
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
      
      console.error("useSuccessfulOrders: Error", errorMessage, err);
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