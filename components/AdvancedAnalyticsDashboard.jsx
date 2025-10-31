'use client'
import { useState } from "react";
import { useSelector } from "react-redux";
import { 
  useAdvancedStoreAnalytics, 
  useRevenueTrend, 
  useProductSalesDistribution, 
  useOrderVolumeByDay, 
  useCustomerAcquisition 
} from "@/lib/hooks/useAdvancedAnalytics";
import DebugStoreId from "@/components/DebugStoreId";
import { 
  TrendingUpIcon, 
  ShoppingBagIcon, 
  DollarSignIcon, 
  UsersIcon,
  BarChart3Icon,
  PieChartIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AdvancedAnalyticsDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const storeId = user?.storeId || user?.store?.id || user?.store?._id;
  
  // Show debug info only in development
  const showDebug = process.env.NODE_ENV === 'development';
  
  // Check if user is a store owner
  const isStoreOwner = user?.role === 'store';
  
  // If user is not a store owner, show appropriate message
  if (!isStoreOwner) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. This page is only available for store owners.</p>
      </div>
    );
  }
  
  // If no storeId found for store owner, show error
  if (isStoreOwner && !storeId) {
    return (
      <div className="p-6">
        {showDebug && <DebugStoreId />}
        <div className="text-center py-8">
          <p className="text-red-600">Store ID not found. Please contact support.</p>
          <p className="text-sm text-gray-500 mt-2">User role: {user?.role}</p>
        </div>
      </div>
    );
  }
  
  // Only call hooks if we have a storeId
  const hasStoreId = !!storeId;
  
  const { data: advancedData, loading: advancedLoading, error: advancedError } = 
    hasStoreId ? useAdvancedStoreAnalytics(storeId) : { data: null, loading: false, error: null };
    
  const { data: revenueTrendData, loading: revenueLoading, error: revenueError } = 
    hasStoreId ? useRevenueTrend(storeId) : { data: null, loading: false, error: null };
    
  const { data: productSalesData, loading: productSalesLoading, error: productSalesError } = 
    hasStoreId ? useProductSalesDistribution(storeId) : { data: null, loading: false, error: null };
    
  const { data: orderVolumeData, loading: orderVolumeLoading, error: orderVolumeError } = 
    hasStoreId ? useOrderVolumeByDay(storeId) : { data: null, loading: false, error: null };
    
  const { data: customerAcquisitionData, loading: customerAcquisitionLoading, error: customerAcquisitionError } = 
    hasStoreId ? useCustomerAcquisition(storeId) : { data: null, loading: false, error: null };
  
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Loading state
  if (advancedLoading || revenueLoading || productSalesLoading || orderVolumeLoading || customerAcquisitionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (advancedError || revenueError || productSalesError || orderVolumeError || customerAcquisitionError) {
    return (
      <div className="p-6">
        {showDebug && <DebugStoreId />}
        <div className="text-center py-8">
          <p className="text-red-600">Error loading analytics: 
            {advancedError || revenueError || productSalesError || orderVolumeError || customerAcquisitionError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showDebug && <DebugStoreId />}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Advanced Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Detailed insights and performance metrics for your store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      {advancedData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-800">
                  ${advancedData.metrics?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSignIcon size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-slate-800">
                  {advancedData.metrics?.totalOrders || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBagIcon size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-slate-800">
                  {advancedData.metrics?.totalProducts || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3Icon size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">New Customers</p>
                <p className="text-2xl font-bold text-slate-800">
                  {advancedData.metrics?.newCustomers || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UsersIcon size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon size={24} className="text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Revenue Trend</h2>
          </div>
          {revenueTrendData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Revenue" 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No revenue trend data available
            </div>
          )}
        </div>

        {/* Product Sales Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon size={24} className="text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Product Sales Distribution</h2>
          </div>
          {productSalesData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {productSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Sales']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No product sales data available
            </div>
          )}
        </div>

        {/* Order Volume by Day */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3Icon size={24} className="text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Order Volume by Day</h2>
          </div>
          {orderVolumeData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Orders']} />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No order volume data available
            </div>
          )}
        </div>

        {/* Customer Acquisition Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <UsersIcon size={24} className="text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Customer Acquisition Trend</h2>
          </div>
          {customerAcquisitionData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerAcquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'New Customers']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  name="New Customers" 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No customer acquisition data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {advancedData?.recentActivity && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {advancedData.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUpIcon size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{activity.title}</p>
                  <p className="text-sm text-slate-600">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;