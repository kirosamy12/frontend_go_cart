'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchStoreProducts } from "@/lib/features/product/productSlice"
import { getStoreOrders } from "@/lib/features/orders/ordersSlice"
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
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
  const router = useRouter()
  const dispatch = useDispatch()
 
  const { token, isAuthenticated, user } = useSelector(state => state.auth)
  const { list: products, loading: productsLoading } = useSelector(state => state.product)
  const { storeOrders, loading: ordersLoading } = useSelector(state => state.orders)

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
    recentOrders: []
  })

  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchStoreProducts())
      dispatch(getStoreOrders())
    }
  }, [dispatch, isAuthenticated, token])

  useEffect(() => {
    if (products.length > 0 && storeOrders.length > 0) {
      // Calculate dashboard data
      const totalProducts = products.length
      const totalEarnings = products.reduce((sum, product) => sum + (product.price * (product.sold || 0)), 0)
      const totalOrders = products.reduce((sum, product) => sum + (product.sold || 0), 0)
      
      // Get recent orders (last 5)
      const recentOrders = [...storeOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      // Mock ratings data
      const mockRatings = products.slice(0, 3).map((product, index) => ({
        id: product.id,
        user: {
          name: `Customer ${index + 1}`,
          image: '/placeholder-image.jpg'
        },
        product: product,
        rating: Math.floor(Math.random() * 5) + 1,
        review: `Great product! ${product.description?.substring(0, 50)}...`,
        createdAt: new Date(Date.now() - index * 86400000).toISOString() // Different dates
      }))

      setDashboardData({
        totalProducts,
        totalEarnings,
        totalOrders,
        ratings: mockRatings,
        recentOrders
      })
    }
  }, [products, storeOrders])

  // Dashboard cards data
  const dashboardCardsData = [
    { 
      title: 'Total Products', 
      value: dashboardData.totalProducts, 
      icon: ShoppingBasketIcon,
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Total Earnings', 
      value: `${currency}${dashboardData.totalEarnings.toLocaleString()}`, 
      icon: CircleDollarSignIcon,
      change: '+8.2%',
      trend: 'up'
    },
    { 
      title: 'Total Orders', 
      value: dashboardData.totalOrders, 
      icon: PackageIcon,
      change: '+5.3%',
      trend: 'up'
    },
    { 
      title: 'Avg. Rating', 
      value: '4.7', 
      icon: StarIcon,
      change: '+0.2',
      trend: 'up'
    },
  ]

  if (productsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
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
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <HomeIcon size={18} />
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/store/add-product')}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <PlusIcon size={18} />
              Add Product
            </button>
            <button 
              onClick={() => router.push('/store/orders')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium border border-slate-200"
            >
              <PackageIcon size={18} />
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCardsData.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
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
              ) : (
                <ArrowDownIcon size={16} className="text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          
          {storeOrders.length > 0 ? (
            <OrdersAreaChart allOrders={storeOrders} />
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
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
            {dashboardData.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="bg-green-100 p-2 rounded-lg">
                  <PackageIcon size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Order #{order.id?.substring(0, 8)}</p>
                  <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">{currency}{order.total}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
            
            {dashboardData.recentOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <PackageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Recent Orders</h2>
            <Link href="/store/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Order #{order.id?.substring(0, 8)}</p>
                  <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{currency}{order.total}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {dashboardData.recentOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <PackageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Customer Reviews</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
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
                            key={starIndex} 
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
              <div className="text-center py-8 text-slate-500">
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