'use client'
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import ModernLoading from "@/components/ModernLoading"
import { PackageIcon, StoreIcon, UserIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react"

export default function StoreOrders() {
  const router = useRouter()
  const params = useParams()
  const { storeId } = params
  
  const [loading, setLoading] = useState(true)
  const [store, setStore] = useState(null)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  const fetchStoreOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      if (!storeId) {
        throw new Error('Store ID is required')
      }
      
      console.log(`Fetching orders for store ${storeId}...`)
      
      const response = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/stores/${storeId}/orders`, {
        headers: {
          'token': token
        }
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('API response data:', result)
        
        setStore(result.store || null)
        setOrders(result.orders || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching store orders:', error)
      setError(error.message || 'Failed to fetch store orders. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (storeId) {
      fetchStoreOrders()
    }
  }, [storeId])

  const formatCurrency = (amount) => {
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'ORDER_PLACED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <ModernLoading />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Data</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={fetchStoreOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : store ? (
        <>
          {/* Store Info Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{store.name}</h1>
                <p className="text-slate-600">@{store.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  store.status === 'approved' ? 'bg-green-100 text-green-800' :
                  store.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {store.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {store.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-slate-600">
                <MailIcon size={18} />
                <span>{store.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <UserIcon size={18} />
                <span>Created: {new Date(store.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <PackageIcon size={18} />
                <span>{orders.length} Orders</span>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Store Orders</h2>
              <p className="text-slate-600">{orders.length} orders found</p>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                      >
                        <td className="py-4 px-4 font-medium text-slate-800">#{order.id?.substring(0, 8)}</td>
                        <td className="py-4 px-4 text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-800">{order.customer?.name || 'N/A'}</p>
                            <p className="text-sm text-slate-600">{order.customer?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-800">
                          ${(order.total || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-800">{order.paymentMethod}</p>
                            <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                              {order.isPaid ? 'Paid' : 'Not Paid'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                  <PackageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500">This store doesn't have any orders yet.</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
            <StoreIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Store not found</h3>
            <p className="text-gray-500">The requested store could not be found.</p>
            <button 
              onClick={() => router.push('/admin')}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}