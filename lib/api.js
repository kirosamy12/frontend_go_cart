import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://go-cart-1bwm.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = token;
  
  // Log requests for debugging
  console.log("API Request:", config.method?.toUpperCase(), config.url, config.params);
  
  return config;
});

// Add interceptors for analytics endpoints
api.interceptors.response.use(
  (response) => {
    // Log responses for debugging
    console.log("API Response:", response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error("API Error:", {
      status: error.response?.status,
      url: error.response?.config?.url,
      method: error.response?.config?.method,
      params: error.response?.config?.params,
      data: error.response?.data,
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall
    });
    
    // Handle different types of errors
    if (!error.response) {
      // Network error
      console.error("Network Error: Check your internet connection or API server availability");
    } else if (error.response?.status === 400) {
      console.error("Bad Request - Check request parameters");
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - Check authentication token");
    } else if (error.response?.status === 403) {
      console.error("Access denied to endpoint");
    } else if (error.response?.status === 404) {
      console.error("Endpoint not found");
    } else if (error.response?.status === 500) {
      console.error("Internal server error");
    }
    
    return Promise.reject(error);
  }
);

// Add specific methods for analytics endpoints
api.getAnalytics = async (role, storeId = null) => {
  let endpoint;
  const params = {};
  
  if (role === 'admin') {
    endpoint = '/admin/revenue-trend';
  } else if (role === 'store') {
    // Use the new dashboard endpoint for store data
    endpoint = '/dashbord/store';
  } else {
    throw new Error("Invalid role");
  }
  
  console.log("Fetching dashboard data:", { role, storeId, endpoint, params });
  
  try {
    const response = await api.get(endpoint, { params });
    console.log("Dashboard API response:", response.data);
    return response;
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    throw error;
  }
};

api.getSalesAnalytics = () => {
  console.log("Fetching sales analytics data");
  return api.get('/admin/revenue-trend');
};

api.updateAnalytics = () => {
  console.log("Updating analytics data");
  return api.post('/admin/revenue-trend/update');
};

// Advanced analytics endpoints
api.getAdvancedStoreAnalytics = (storeId) => {
  console.log("Fetching advanced store analytics data for storeId:", storeId);
  return api.get('/admin/revenue-trend');
};

api.getRevenueTrend = (storeId) => {
  console.log("Fetching revenue trend data for storeId:", storeId);
  // For admin users, use the admin revenue trend endpoint
  // For store users, use the store-specific endpoint
  const endpoint = storeId ? `/dashbord/store/${storeId}` : '/admin/revenue-trend';
  return api.get(endpoint);
};

api.getProductSalesDistribution = (storeId) => {
  console.log("Fetching product sales distribution data for storeId:", storeId);
  return api.get('/admin/revenue-trend');
};

api.getOrderVolumeByDay = (storeId) => {
  console.log("Fetching order volume by day data for storeId:", storeId);
  return api.get('/admin/revenue-trend');
};

api.getCustomerAcquisition = (storeId) => {
  console.log("Fetching customer acquisition data for storeId:", storeId);
  return api.get('/admin/revenue-trend');
};

export default api;