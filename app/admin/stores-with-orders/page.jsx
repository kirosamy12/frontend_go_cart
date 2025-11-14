'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ModernLoading from "@/components/ModernLoading"
import StoreInfoImproved from "@/components/admin/StoreInfoImproved"
import { PackageIcon, StoreIcon } from "lucide-react"

export default function StoresWithOrders() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState([])
  const [error, setError] = useState(null)

  const fetchStoresWithOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      console.log('Fetching stores with orders data...')
      
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/admin/stores-with-orders', {
        headers: {
          'token': token
        }
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('API response data:', result)
        
        setStores(result.stores || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching stores with orders:', error)
      setError(error.message || 'Failed to fetch stores with orders. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoresWithOrders()
  }, [])

  if (loading) {
    return <ModernLoading />
  }

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stores with Orders</h1>
          <p className="text-slate-600 mt-1">View all stores and their recent orders</p>
        </div>
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
            onClick={fetchStoresWithOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div 
              key={store.id} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/stores/${store.id}/orders`)}
            >
              <StoreInfoImproved store={store} />
              
              {/* Orders section for this store */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Recent Orders</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {store.ordersCount || 0} orders
                  </span>
                </div>
                
                {store.orders && store.orders.length > 0 ? (
                  <div className="space-y-3">
                    {store.orders.slice(0, 3).map((order, index) => (
                      <div 
                        key={order.id || `order-${index}`} 
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">#{order.id?.substring(0, 8)}</p>
                          <p className="text-xs text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-800">${(order.total || 0).toFixed(2)}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'ORDER_PLACED' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {store.orders.length > 3 && (
                      <div className="text-center pt-2">
                        <p className="text-xs text-slate-500">+{store.orders.length - 3} more orders</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <PackageIcon size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No orders yet</p>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
            <StoreIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No stores found</h3>
            <p className="text-gray-500">There are no stores with orders at the moment.</p>
          </div>
        </div>
      )}
    </div>
  )
}