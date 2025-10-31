import { useEffect, useState, useCallback } from "react";
import api from "../api";

export const useAdvancedStoreAnalytics = (storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have a storeId
      if (!storeId) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Fetch advanced analytics data for store
      const response = await api.getAdvancedStoreAnalytics(storeId);
      
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading advanced analytics data";
      console.error("useAdvancedStoreAnalytics: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useRevenueTrend = (storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have a storeId
      if (!storeId) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Fetch revenue trend data
      const response = await api.getRevenueTrend(storeId);
      
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading revenue trend data";
      console.error("useRevenueTrend: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useProductSalesDistribution = (storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have a storeId
      if (!storeId) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Fetch product sales distribution data
      const response = await api.getProductSalesDistribution(storeId);
      
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading product sales distribution data";
      console.error("useProductSalesDistribution: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useOrderVolumeByDay = (storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have a storeId
      if (!storeId) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Fetch order volume by day data
      const response = await api.getOrderVolumeByDay(storeId);
      
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading order volume data";
      console.error("useOrderVolumeByDay: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useCustomerAcquisition = (storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have a storeId
      if (!storeId) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Fetch customer acquisition data
      const response = await api.getCustomerAcquisition(storeId);
      
      setData(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error loading customer acquisition data";
      console.error("useCustomerAcquisition: Error", errorMessage, err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};