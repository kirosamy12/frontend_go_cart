'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { 
  StoreIcon, 
  UsersIcon, 
  BarChart3Icon, 
  TrendingUpIcon, 
  PackageIcon,
  ShoppingCartIcon,
  DollarSignIcon
} from 'lucide-react'
import ModernLoading from '@/components/ModernLoading'
import StoreInfoImproved from '@/components/admin/StoreInfoImproved'
import ShippingCostManagerImproved from '@/components/admin/ShippingCostManagerImproved'
import OrdersAreaChartImproved from '@/components/OrdersAreaChartImproved'
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard'

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'
  const router = useRouter()
  const { user, token } = useSelector(state => state.auth) // Get token from Redux store

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
      value: dashboardData.products || 0, 
      icon: ShoppingCartIcon,
      change: '+15%',
      trend: 'up'
    },
    { 
      id: 'total-revenue',
      title: 'Total Revenue', 
      value: `${currency}${(dashboardData.revenue || 0).toLocaleString()}`, 
      icon: DollarSignIcon,
      change: '+12%',
      trend: 'up'
    },
    { 
      id: 'total-orders',
      title: 'Total Orders', 
      value: dashboardData.orders || 0, 
      icon: PackageIcon,
      change: '+8%',
      trend: 'up'
    },
    { 
      id: 'total-stores',
      title: 'Total Stores', 
      value: dashboardData.stores || 0, 
      icon: StoreIcon,
      change: '+5%',
      trend: 'up'
    },
    { 
      id: 'total-users',
      title: 'Total Users', 
      value: dashboardData.users || 0, 
      icon: UsersIcon,
      change: '+3%',
      trend: 'up'
    },
  ]

  const fetchDashboardData = async () => {
    try {
      // Get token from Redux store first, then fallback to localStorage
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('Fetching dashboard data with token from Redux store:', 
        token ? 'Redux token' : 'localStorage token');
      console.log('Token preview:', authToken.substring(0, 10) + '...');
      
      try {
        // Fetch consolidated dashboard data from the REAL endpoint
        console.log('Fetching consolidated dashboard data from real API...');
        const dashboardResponse = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
          headers: {
            'token': authToken
          }
        });
        
        console.log('Dashboard API response status:', dashboardResponse.status);
        console.log('Dashboard API response ok:', dashboardResponse.ok);
        
        if (dashboardResponse.ok) {
          const dashboardResult = await dashboardResponse.json();
          console.log('Dashboard API response data:', dashboardResult);
          
          const dashboardData = dashboardResult.data || {};
          console.log('Dashboard data extracted:', dashboardData);
          
          // Set dashboard data with the real data
          setDashboardData({
            products: dashboardData.totalProducts || 0,
            revenue: dashboardData.totalRevenue || 0,
            orders: dashboardData.totalOrders || 0,
            stores: dashboardData.totalStores || 0,
            users: dashboardData.totalUsers || 0,
            allOrders: [], // We'll transform recentSales to orders if needed
            recentSales: dashboardData.recentSales || [], // Add recentSales data
          });
          
          // Set stores data if available
          if (dashboardData.storesWithProducts?.stores) {
            setStores(dashboardData.storesWithProducts.stores);
          } else if (dashboardData.storeRevenues) {
            // Fallback to storeRevenues if storesWithProducts is not available
            const storesFromRevenues = dashboardData.storeRevenues.map(store => ({
              id: store._id,
              name: store.storeName,
              revenue: store.revenue
            }));
            setStores(storesFromRevenues);
          }
        } else {
          console.error('Failed to fetch dashboard data:', dashboardResponse.status, dashboardResponse.statusText);
          // Fallback to separate endpoints
          await fetchFromSeparateEndpoints(authToken);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to separate endpoints
        await fetchFromSeparateEndpoints(authToken);
      }
    } catch (error) {
      // Provide more detailed error information
      let errorMessage = "Error fetching dashboard data";
      
      console.error('Error fetching dashboard data:', error);
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                      `Server error ${error.response.status}: ${error.response.statusText}` || 
                      errorMessage;
        console.error('Server error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        // Network error
        errorMessage = "Network error - Check your internet connection or API server availability";
        console.error('Network error details:', error.request);
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
        console.error('Other error details:', error.message);
      }
      
      // Show error to user with more details
      alert(`Failed to load dashboard data: ${errorMessage}\n\nPlease check the console for more details.`);
      
      setDashboardData({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        users: 0,
        allOrders: [],
        recentSales: [],
      });
      setStores([]);
    }
    setLoading(false);
  }
  
  // Fallback function to fetch data from separate endpoints
  const fetchFromSeparateEndpoints = async (authToken) => {
    console.log('Falling back to separate endpoints...');
    
    // Fetch data from working endpoints
    let storesData = [];
    let usersData = [];
    let pendingStoresData = [];
    let ordersData = [];
    
    try {
      // Fetch all stores data using the working endpoint
      console.log('Fetching all stores data...');
      const storesResponse = await fetch('https://go-cart-1bwm.vercel.app/api/getAllStores', {
        headers: {
          'token': authToken
        }
      });
      
      console.log('Stores API response status:', storesResponse.status);
      console.log('Stores API response ok:', storesResponse.ok);
      
      if (storesResponse.ok) {
        const storesResult = await storesResponse.json();
        console.log('Stores API response data:', storesResult);
        storesData = storesResult.stores || [];
        console.log('All stores data fetched successfully:', storesData.length, 'stores');
      } else {
        console.error('Failed to fetch all stores data:', storesResponse.status, storesResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching all stores data:', error);
    }
    
    try {
      // Fetch users data using the working endpoint
      console.log('Fetching users data...');
      const usersResponse = await fetch('https://go-cart-1bwm.vercel.app/api/admin/users', {
        headers: {
          'token': authToken
        }
      });
      
      console.log('Users API response status:', usersResponse.status);
      console.log('Users API response ok:', usersResponse.ok);
      
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        console.log('Users API response data:', usersResult);
        usersData = usersResult.users || [];
        console.log('Users data fetched successfully:', usersData.length, 'users');
      } else {
        console.error('Failed to fetch users data:', usersResponse.status, usersResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
    
    try {
      // Fetch pending stores data using the working endpoint
      console.log('Fetching pending stores data...');
      const pendingStoresResponse = await fetch('https://go-cart-1bwm.vercel.app/api/admin/stores/pending', {
        headers: {
          'token': authToken
        }
      });
      
      console.log('Pending stores API response status:', pendingStoresResponse.status);
      console.log('Pending stores API response ok:', pendingStoresResponse.ok);
      
      if (pendingStoresResponse.ok) {
        const pendingStoresResult = await pendingStoresResponse.json();
        console.log('Pending stores API response data:', pendingStoresResult);
        pendingStoresData = pendingStoresResult.stores || [];
        console.log('Pending stores data fetched successfully:', pendingStoresData.length, 'stores');
      } else {
        console.error('Failed to fetch pending stores data:', pendingStoresResponse.status, pendingStoresResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching pending stores data:', error);
    }
    
    try {
      // Fetch orders data using the working endpoint
      console.log('Fetching orders data...');
      const ordersResponse = await fetch('https://go-cart-1bwm.vercel.app/api/store/orders/successful', {
        headers: {
          'token': authToken
        }
      });
      
      console.log('Orders API response status:', ordersResponse.status);
      console.log('Orders API response ok:', ordersResponse.ok);
      
      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        console.log('Orders API response data:', ordersResult);
        ordersData = ordersResult.orders || [];
        console.log('Orders data fetched successfully:', ordersData.length, 'orders');
      } else {
        console.error('Failed to fetch orders data:', ordersResponse.status, ordersResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders data:', error);
    }
    
    // Try to add ordersCount to storesData by grouping orders by storeId
    if (storesData.length > 0 && ordersData.length > 0) {
      // Create a map of storeId to order count
      const storeOrderCounts = {};
      ordersData.forEach(order => {
        const storeId = order.storeId || order.store?.id || order.store?._id;
        if (storeId) {
          storeOrderCounts[storeId] = (storeOrderCounts[storeId] || 0) + 1;
        }
      });
      
      // Add ordersCount to each store
      storesData = storesData.map(store => ({
        ...store,
        ordersCount: storeOrderCounts[store.id] || storeOrderCounts[store._id] || 0
      }));
    }
    
    // Set dashboard data with what we have
    setDashboardData({
      products: 0, // We don't have a direct endpoint for this yet
      revenue: 0, // We don't have a direct endpoint for this yet
      orders: ordersData.length,
      stores: storesData.length,
      users: usersData.length,
      allOrders: ordersData, // Set the orders data
      recentSales: [], // No recent sales data in fallback
    });
    
    // For stores section, we'll show all stores
    setStores(storesData || []);
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <ModernLoading />

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, Admin!</h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
              
              {(dashboardData.recentSales?.length > 0 || dashboardData.allOrders?.length > 0) ? (
                <OrdersAreaChartImproved 
                  allOrders={dashboardData.recentSales?.length > 0 ? 
                    dashboardData.recentSales.map(sale => ({
                      createdAt: sale._id, // Use the date as createdAt
                      // Add other properties that the chart might need
                    })) : 
                    dashboardData.allOrders
                  } 
                />
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
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
                  <div 
                    key={store.id} 
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/admin/stores/${store.id}/orders`)}
                  >
                    <StoreInfoImproved store={store} />
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

      {/* Shipping Cost Management Section */}
      <div className="mt-8">
        <ShippingCostManagerImproved />
      </div>
    </div>
  )
}