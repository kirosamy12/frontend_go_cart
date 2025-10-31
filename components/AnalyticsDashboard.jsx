'use client'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAnalyticsData, useSalesAnalytics, updateAnalytics } from "@/lib/hooks/useAnalyticsData";
import { 
  StoreIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  BarChart3Icon,
  RefreshCwIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from "react-hot-toast";

const AnalyticsDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  
  // For store owners, extract storeId from user object
  const storeId = isAdmin ? null : (user?.storeId || user?.store?.id || user?.store?._id);
  
  const { data: overallData, loading: overallLoading, error: overallError, refetch: refetchOverall } = useAnalyticsData("admin");
  const { data: storeData, loading: storeLoading, error: storeError, refetch: refetchStore } = useAnalyticsData("store", storeId);
  const { data: salesData, loading: salesLoading, error: salesError, refetch: refetchSales } = useSalesAnalytics();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateAnalytics = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateAnalytics();
      // Refresh all data after update
      if (isAdmin) {
        refetchOverall();
        refetchSales();
      } else {
        refetchStore();
      }
      toast.success("Analytics updated successfully");
    } catch (error) {
      toast.error("Failed to update analytics: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Prepare data for charts
  const revenueByMonthData = salesData?.revenueByMonth?.map(item => ({
    month: item.month,
    revenue: item.revenue
  })) || [];

  const revenueByStoreData = salesData?.revenueByStore?.map(item => ({
    name: item.storeName,
    value: item.revenue
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (overallLoading || storeLoading || salesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (overallError || storeError || salesError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading analytics: {overallError || storeError || salesError}</p>
      </div>
    );
  }

  const data = isAdmin ? overallData : storeData;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">
            {isAdmin 
              ? "Comprehensive platform analytics and insights" 
              : "Store performance metrics and analytics"}
          </p>
        </div>
        <button
          onClick={handleUpdateAnalytics}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCwIcon size={18} className={isUpdating ? "animate-spin" : ""} />
          {isUpdating ? "Updating..." : "Update Analytics"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Stores</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.metrics?.totalStores || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <StoreIcon size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.metrics?.totalUsers || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <UsersIcon size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.metrics?.totalOrders || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ShoppingBagIcon size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">${data?.metrics?.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <DollarSignIcon size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.metrics?.totalOrders || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingBagIcon size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">${data?.metrics?.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSignIcon size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.metrics?.totalProducts || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <StoreIcon size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Top Product</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.topProducts?.[0]?.sold || 0} sold</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUpIcon size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon size={24} className="text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">Revenue Trend</h2>
          </div>
          {revenueByMonthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Store Performance (Admin only) */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3Icon size={24} className="text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-800">Top Stores</h2>
            </div>
            {revenueByStoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByStoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No store data available
              </div>
            )}
          </div>
        )}

        {/* Top Products (Store only) */}
        {!isAdmin && data?.topProducts && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUpIcon size={24} className="text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-800">Top Products</h2>
            </div>
            {data.topProducts.length > 0 ? (
              <div className="space-y-4">
                {data.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{product.sold} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-500">
                No product data available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBagIcon size={24} className="text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            {isAdmin ? "Recent Platform Orders" : "Recent Store Orders"}
          </h2>
        </div>
        {data?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">#{order.id?.substring(0, 8)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.customer?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'ORDER_PLACED' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-slate-500">
            No recent orders
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;