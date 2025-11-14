'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useAnalyticsData } from "@/lib/hooks/useAnalyticsData";
import { useSuccessfulOrders } from "@/lib/hooks/useSuccessfulOrders";
import {
  ShoppingBasketIcon,
  CircleDollarSignIcon,
  PackageIcon,
  StarIcon,
  TrendingUpIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HomeIcon
} from "lucide-react"
import Link from "next/link"
import OrdersAreaChart from "@/components/OrdersAreaChart"

const ModernStoreDashboard = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'
  const router = useRouter()
  const dispatch = useDispatch()
 
  const { token, isAuthenticated, user } = useSelector(state => state.auth)
  console.log("ModernStoreDashboard - User data:", user);
  const storeId = user?.storeId || user?.store?.id || user?.store?._id;
  console.log("ModernStoreDashboard - StoreId:", storeId);
  const { data, loading, error } = useAnalyticsData("store");
  const { data: successfulOrdersData, loading: successfulOrdersLoading, error: successfulOrdersError } = useSuccessfulOrders();

  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  // Dashboard data derived from analytics
  const dashboardData = {
    totalProducts: data?.metrics?.totalProducts || 0,
    totalEarnings: data?.metrics?.totalRevenue || 0,
    totalOrders: data?.metrics?.totalOrders || 0,
    recentOrders: data?.recentOrders || [],
    pendingOrders: data?.pendingOrders || [],
    ratings: (data?.metrics?.topProduct ? [data.metrics.topProduct] : []).map((product, index) => ({
      id: product._id || product.id || `product-${index}`,
      user: {
        name: `Customer ${index + 1}`,
        image: '/placeholder-image.jpg'
      },
      product: product,
      rating: 5, // Using 5 stars for top product
      review: `Great product! ${product.productName || product.name || 'Product'}`,
      createdAt: new Date(Date.now() - index * 86400000).toISOString()
    })) || []
  };

  // Dashboard cards data
  const dashboardCardsData = [
    { 
      id: 'total-products',
      title: 'Total Products', 
      value: dashboardData.totalProducts, 
      icon: ShoppingBasketIcon,
      change: '+12%',
      trend: 'up'
    },
    { 
      id: 'total-earnings',
      title: 'Total Earnings', 
      value: `${currency}${dashboardData.totalEarnings.toLocaleString()}`, 
      icon: CircleDollarSignIcon,
      change: '+8.2%',
      trend: 'up'
    },
    { 
      id: 'total-orders',
      title: 'Total Orders', 
      value: dashboardData.totalOrders, 
      icon: PackageIcon,
      change: '+5.3%',
      trend: 'up'
    },
    { 
      id: 'pending-orders',
      title: 'Pending Orders', 
      value: data?.pendingOrders?.length || 0, 
      icon: PackageIcon,
      change: '0%',
      trend: 'neutral'
    },
  ]

  // Format currency
  const formatCurrency = (amount) => {
    // Handle potential null or undefined values
    if (!amount && amount !== 0) return 'N/A'
    
    // Convert amount to number if it's not already
    const numAmount = Number(amount) || 0;
    
    // Check if the amount is a whole number
    if (Number.isInteger(numAmount)) {
      // For whole numbers, display without decimals
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numAmount);
    } else {
      // For decimal numbers, display with 2 decimal places
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numAmount);
    }
  }

  // Format date
  const formatDate = (dateString) => {
    // Handle potential null or undefined values
    if (!dateString) return 'N/A'
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (e) {
      return 'Invalid Date'
    }
  }

  if (loading || successfulOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error || successfulOrdersError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-4">{error || successfulOrdersError}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-medium mb-2">Troubleshooting Tips:</p>
            <ul className="text-left text-sm text-yellow-700 space-y-1 max-w-md mx-auto">
              <li key="tip1">• Check your internet connection</li>
              <li key="tip2">• Verify the API server is running</li>
              <li key="tip3">• Try refreshing the page</li>
              <li key="tip4">• Check if you have created a store</li>
              <li key="tip5">• Visit <a href="/debug-store" className="underline font-medium">/debug-store</a> to see your account details</li>
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center mt-6">
            <button 
              key="debug-info-button"
              onClick={() => router.push('/debug-store')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              Debug Info
            </button>
            <button 
              key="refresh-page-button"
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, {user?.name || 'Store Owner'}!</h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              key="home-button"
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <HomeIcon size={18} />
              Back to Home
            </button>
            <button 
              key="add-product-button"
              onClick={() => router.push('/store/add-product')}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <PlusIcon size={18} />
              Add Product
            </button>
            <button 
              key="view-orders-button"
              onClick={() => router.push('/store/orders')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium border border-slate-200"
            >
              <PackageIcon size={18} />
              View Orders
            </button>
            <button 
              key="view-invoices-button"
              onClick={() => router.push('/store/invoices')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium border border-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              View Invoices
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCardsData.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <card.icon size={24} className="text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {card.trend === 'up' ? (
                <ArrowUpIcon size={16} className="text-green-500" />
              ) : card.trend === 'down' ? (
                <ArrowDownIcon size={16} className="text-red-500" />
              ) : (
                <div className="w-4 h-4"></div> // Empty spacer for neutral trend
              )}
              <span className={`text-sm font-medium ml-1 ${
                card.trend === 'up' ? 'text-green-600' : 
                card.trend === 'down' ? 'text-red-600' : 
                'text-slate-500'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-slate-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUpIcon size={20} className="text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-800">Sales Analytics</h2>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"
              >
                <option key="7d" value="7d">Last 7 days</option>
                <option key="30d" value="30d">Last 30 days</option>
                <option key="90d" value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          
          {data?.salesAnalytics?.length > 0 ? (
            <OrdersAreaChart allOrders={data.salesAnalytics} />
          ) : (
            <div key="no-orders-data" className="h-80 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <TrendingUpIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No orders data available yet</p>
                <p className="text-sm">Start selling to see your analytics here</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {data?.recentActivity?.slice(0, 5).map((activity, index) => (
              <div key={activity.id || activity._id || `activity-${index}`} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <PackageIcon size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Order #{(activity.id || activity._id || `activity-${index}`).substring(0, 8)}</p>
                  <p className="text-sm text-slate-600">{new Date(activity.updatedAt || activity.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  activity.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  activity.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                  activity.status === 'ORDER_PLACED' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
            
            {(data?.recentActivity?.length === 0 || !data?.recentActivity) && (
              <div key="no-recent-activity" className="text-center py-8 text-slate-500">
                <PackageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Successful Orders and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Successful Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Successful Orders</h2>
            <Link key="view-all-orders-link" href="/store/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {successfulOrdersData?.orders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Order #{order.id?.substring(0, 8)}</p>
                  <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                  {order.customer && (
                    <p className="text-xs text-slate-500 mt-1">Customer: {order.customer.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
            
            {(successfulOrdersData?.orders?.length === 0 || !successfulOrdersData?.orders) && (
              <div key="no-successful-orders" className="text-center py-8 text-slate-500">
                <PackageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No successful orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Customer Reviews</h2>
            <button key="view-all-reviews-button" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.ratings.map((review) => (
              <div key={review.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-800">{review.user.name}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <StarIcon 
                            key={`star-${review.id}-${starIndex}`} 
                            size={14} 
                            className="text-yellow-400" 
                            fill={review.rating >= starIndex ? "#fbbf24" : "transparent"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{review.product?.name}</p>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {dashboardData.ratings.length === 0 && (
              <div key="no-reviews" className="text-center py-8 text-slate-500">
                <StarIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernStoreDashboard