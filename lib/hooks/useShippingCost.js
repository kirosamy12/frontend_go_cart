import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Hook to fetch shipping cost based on governorate
export const useShippingCost = (governorate) => {
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (!governorate) {
        setShippingCost(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // API endpoint to get shipping cost for a specific governorate
        const response = await api.get(`/shipping-cost/${encodeURIComponent(governorate)}`);
        
        const data = response.data;
        
        if (data.success && data.shippingCost !== undefined) {
          // Ensure shipping cost is a number
          const cost = Number(data.shippingCost);
          setShippingCost(isNaN(cost) ? 0 : cost);
        } else {
          // If no specific cost found, default to 0 (free shipping)
          setShippingCost(0);
        }
      } catch (err) {
        console.error('Error fetching shipping cost:', err);
        setError(err.message);
        // Default to 0 on error
        setShippingCost(0);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingCost();
  }, [governorate]);

  return { shippingCost, loading, error };
};

// Hook to fetch all shipping costs (for admin management)
export const useAllShippingCosts = () => {
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllShippingCosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // API endpoint to get all shipping costs
      const response = await api.get('/admin/shipping-costs');
      
      const data = response.data;
      
      if (data.success && Array.isArray(data.shippingCosts)) {
        setShippingCosts(data.shippingCosts);
      } else {
        setShippingCosts([]);
      }
    } catch (err) {
      console.error('Error fetching all shipping costs:', err);
      setError(err.message);
      setShippingCosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShippingCosts();
  }, []);

  return { shippingCosts, loading, error, refetch: fetchAllShippingCosts };
};

// Function to update shipping cost for a governorate (for admin)
export const updateShippingCost = async (governorate, cost) => {
  try {
    const response = await api.put('/shipping-cost', { governorate, shippingCost: cost, isActive: true });
    
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error updating shipping cost:', error);
    throw error;
  }
};