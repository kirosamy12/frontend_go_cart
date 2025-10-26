'use client'
import { useSelector } from "react-redux";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import Card from "./Card";
import { StoreIcon, UsersIcon, ShoppingBagIcon, DollarSignIcon, TrendingUpIcon, BarChart3Icon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { data, loading, error } = useDashboardData("admin");

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
  const monthlyRevenueData = data?.monthlyRevenue?.map(item => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item._id - 1],
    revenue: item.total
  })) || [];

  const storeRevenuesData = data?.storeRevenues?.map(item => ({
    name: item.storeName,
    revenue: item.revenue
  })) || [];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 mb-8 border border-blue-100 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Here's an overview of your platform performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Stores"
          value={data?.totalStores || 0}
          icon={StoreIcon}
          color="blue"
        />
        <Card
          title="Total Users"
          value={data?.totalUsers || 0}
          icon={UsersIcon}
          color="green"
        />
        <Card
          title="Total Orders"
          value={data?.totalOrders || 0}
          icon={ShoppingBagIcon}
          color="purple"
        />
        <Card
          title="Total Revenue"
          value={`$${data?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSignIcon}
          color="orange"
        />
      </div>

      {/* Top Store */}
      {data?.topStore && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUpIcon size={24} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Top Performing Store</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.topStore.storeName}</h3>
              <p className="text-slate-600 dark:text-slate-400">Highest revenue this month</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">${data.topStore.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Revenues Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3Icon size={24} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Store Revenues</h2>
          </div>
          {storeRevenuesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeRevenuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
              No revenue data available
            </div>
          )}
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon size={24} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Monthly Revenue</h2>
          </div>
          {monthlyRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
              No monthly data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
