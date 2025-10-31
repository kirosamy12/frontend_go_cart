'use client'
import { useSelector } from "react-redux";
import { useAnalyticsData } from "@/lib/hooks/useAnalyticsData";
import Card from "./Card";
import { ShoppingBagIcon, DollarSignIcon, PackageIcon, TrendingUpIcon, StarIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StoreDashboard = () => {
  const { user } = useSelector(state => state.auth);
  console.log("User data in StoreDashboard:", user); // Debug log
  const storeId = user?.storeId || user?.store?.id || user?.store?._id;
  console.log("Using storeId:", storeId); // Debug log
  const { data, loading, error } = useAnalyticsData("store", storeId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  } 

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  // Prepare chart data
  const monthlySalesData = data?.ordersByDay?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: item.count
  })) || [];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 mb-8 border border-green-100 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {user?.name || 'Store Owner'}!</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Orders"
          value={data?.metrics?.totalOrders || 0}
          icon={ShoppingBagIcon}
          color="blue"
        />
        <Card
          title="Total Revenue"
          value={`$${data?.metrics?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSignIcon}
          color="green"
        />
        <Card
          title="Total Products"
          value={data?.metrics?.totalProducts || 0}
          icon={PackageIcon}
          color="purple"
        />
        <Card
          title="Top Product Sales"
          value={data?.topProducts?.[0]?.sold || 0}
          icon={StarIcon}
          color="orange"
        />
      </div>

      {/* Top Product */}
      {data?.topProducts?.[0] && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StarIcon size={24} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Top Selling Product</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.topProducts[0].name}</h3>
              <p className="text-slate-600 dark:text-slate-400">Best performing product</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{data.topProducts[0].sold} sold</p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUpIcon size={24} className="text-slate-600 dark:text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Sales Trend</h2>
        </div>
        {monthlySalesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Orders']} />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            No sales data available
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDashboard;