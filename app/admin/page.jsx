'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import ModernLoading from "@/components/ModernLoading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard"
import StoreInfo from "@/components/admin/StoreInfo"
import {
  ShoppingBasketIcon,
  CircleDollarSignIcon,
  StoreIcon,
  PackageIcon,
  UsersIcon,
  TrendingUpIcon,
  HomeIcon,
  BarChart3Icon
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    users: 0,
    allOrders: [],
  })
  
  const [stores, setStores] = useState([])

  const [activeView, setActiveView] = useState('overview') // 'overview' or 'analytics'
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  const dashboardCardsData = [
    { 
      id: 'total-products',
      title: 'Total Products', 
      value: dashboardData.products, 
      icon: ShoppingBasketIcon,
      change: '+15%',
      trend: 'up'
    },
    { 
      id: 'total-revenue',
      title: 'Total Revenue', 
      value: `${currency}${dashboardData.revenue.toLocaleString()}`, 
      icon: CircleDollarSignIcon,
      change: '+12%',
      trend: 'up'
    },
    { 
      id: 'total-orders',
      title: 'Total Orders', 
      value: dashboardData.orders, 
      icon: PackageIcon,
      change: '+8%',
      trend: 'up'
    },
    { 
      id: 'total-stores',
      title: 'Total Stores', 
      value: dashboardData.stores, 
      icon: StoreIcon,
      change: '+5%',
      trend: 'up'
    },
    { 
      id: 'total-users',
      title: 'Total Users', 
      value: dashboardData.users, 
      icon: UsersIcon,
      change: '+3%',
      trend: 'up'
    },
  ]

  const fetchDashboardData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')

      // Fetch summary data from the new endpoint
      const summaryRes = await fetch('https://go-cart-1bwm.vercel.app/api/admin/summary', {
        headers: {
          'token': token ? `${token}` : '',
          'Content-Type': 'application/json',
        }
      })

      // Fetch orders data from the existing dashboard endpoint
      const dashboardRes = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
        headers: {
          'token': token ? `${token}` : '',
          'Content-Type': 'application/json',
        }
      })

      // Fetch stores data
      const storesRes = await fetch('https://go-cart-1bwm.vercel.app/api/getAllStores', {
        headers: {
          'token': token ? `${token}` : '',
          'Content-Type': 'application/json',
        }
      })

      let summaryData = null
      let dashboardData = null
      let storesData = null

      if (summaryRes.ok) {
        const summaryResponse = await summaryRes.json()
        if (summaryResponse.success) {
          summaryData = summaryResponse.data
        }
      }

      if (dashboardRes.ok) {
        dashboardData = await dashboardRes.json()
      }

      if (storesRes.ok) {
        const storesResponse = await storesRes.json()
        storesData = storesResponse.stores || []
      }

      // Combine data from all endpoints
      setDashboardData({
        products: summaryData?.totalProducts || dashboardData?.products || 0,
        revenue: summaryData?.totalRevenue || dashboardData?.revenue || 0,
        orders: summaryData?.totalOrders || dashboardData?.orders || 0,
        stores: summaryData?.totalStores || dashboardData?.stores || 0,
        users: dashboardData?.users || 0,
        allOrders: dashboardData?.allOrders || [],
      })
      
      setStores(storesData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDashboardData({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        users: 0,
        allOrders: [],
      })
      setStores([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <ModernLoading />

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, Admin!</h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your platform today.</p>
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
              onClick={() => router.push('/admin/stores')}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <StoreIcon size={18} />
              Manage Stores
            </button>
            <button 
              onClick={() => router.push('/admin/users')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium border border-slate-200"
            >
              <UsersIcon size={18} />
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'overview' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3Icon size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'analytics' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3Icon size={16} />
            Advanced Analytics
          </button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  <span className="text-sm font-medium text-green-600 ml-1">{card.change}</span>
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
                  <h2 className="text-xl font-semibold text-slate-800">Platform Sales Analytics</h2>
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
              
              {dashboardData.allOrders?.length > 0 ? (
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <TrendingUpIcon size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>No orders data available yet</p>
                    <p className="text-sm">Start getting stores to see your analytics here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent Platform Activity</h2>
              
              <div className="space-y-4">
                {dashboardData.allOrders?.slice(0, 5).map((order, index) => (
                  <div key={order.id || order._id || `order-${index}`} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <PackageIcon size={16} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Order #{(order.id || order._id || `order-${index}`).substring(0, 8)}</p>
                      <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'ORDER_PLACED' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
                
                {(dashboardData.allOrders?.length === 0 || !dashboardData.allOrders) && (
                  <div className="text-center py-8 text-slate-500">
                    <PackageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Stores Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Active Stores</h2>
              <button 
                onClick={() => router.push('/admin/stores')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                View All Stores
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
            {stores?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.slice(0, 3).map((store) => (
                  <div key={store.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <StoreInfo store={store} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <StoreIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No active stores yet</p>
                <button 
                  onClick={() => router.push('/admin/stores')}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Manage Stores
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <AdvancedAnalyticsDashboard />
        </div>
      )}
    </div>
  )
}