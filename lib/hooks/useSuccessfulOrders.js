import { useEffect, useState, useCallback } from "react";

export const useSuccessfulOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("useSuccessfulOrders: Fetching successful orders data");
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('Request timeout after 10 seconds');
      }, 10000); // 10 second timeout

      // Use the correct endpoint for successful orders based on memory
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/store/orders/successful', {
        method: 'GET',
        headers: {
          'token': token,
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log("useSuccessfulOrders: Received response", response.status);
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
          console.error('API error data:', errorData);
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            console.error('API error text:', errorText);
            errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
          } catch (textError) {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
        }
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("useSuccessfulOrders: Parsed response data", result);
      
      setData(result);
    } catch (err) {
      // Provide more detailed error information
      let errorMessage = "Error loading successful orders data";
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your internet connection and try again.';
      } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and ensure the API server is running.';
      } else {
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