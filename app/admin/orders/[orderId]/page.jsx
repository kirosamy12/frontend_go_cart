'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import ModernLoading from "@/components/ModernLoading"
import Image from "next/image"
import { 
  PackageIcon, 
  UserIcon, 
  StoreIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon,
  CreditCardIcon,
  TagIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from "lucide-react"

export default function AdminOrderDetails() {
  const router = useRouter()
  const params = useParams()
  const { orderId } = params
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Available status options
  const statusOptions = [
    "ORDER_PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      if (!orderId) {
        throw new Error('Order ID is required')
      }
      
      console.log(`Fetching details for order ${orderId}...`)
      
      const response = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/orders/${orderId}/details`, {
        headers: {
          'token': token
        }
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('API response data:', result)
        
        setOrder(result.order || null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError(error.message || 'Failed to fetch order details. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      setShowStatusDropdown(false)
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      if (!orderId) {
        throw new Error('Order ID is required')
      }
      
      // Get storeId from the order object
      const storeId = order?.store?.id
      if (!storeId) {
        throw new Error('Store ID not found in order data')
      }
      
      console.log(`Updating order ${orderId} status to ${newStatus}...`)
      
      const response = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/stores/${storeId}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      console.log('Status update API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Status update API response data:', result)
        
        // Update the order status in state
        setOrder(prevOrder => ({
          ...prevOrder,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }))
        
        // Show success message
        alert('Order status updated successfully!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert(error.message || 'Failed to update order status. Please try again later.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

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
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
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
            onClick={fetchOrderDetails}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : order ? (
        <>
          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
                <p className="text-slate-600">Order ID: #{order.id}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Status Update Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={updatingStatus}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      updatingStatus 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                    <ChevronDownIcon size={16} />
                  </button>
                  
                  {showStatusDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(status)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                              order.status === status 
                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                : 'text-slate-700'
                            }`}
                          >
                            {status.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarIcon size={18} />
                <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarIcon size={18} />
                <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCardIcon size={18} />
                <span>Payment: {order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer & Store Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <UserIcon size={20} />
                  Customer Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium">{order.customer?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{order.customer?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="font-medium">
                      {order.customer?.memberSince 
                        ? new Date(order.customer.memberSince).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  
                  {order.customer?.phone && (
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{order.customer.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Store Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <StoreIcon size={20} />
                  Store Information
                </h2>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      {order.store?.logo ? (
                        <Image 
                          width={64} 
                          height={64} 
                          src={order.store.logo} 
                          alt={order.store.name} 
                          className="rounded-xl object-cover w-full h-full"
                        />
                      ) : (
                        <StoreIcon className="text-gray-400" size={24} />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800">{order.store?.name || 'N/A'}</h3>
                    <p className="text-sm text-slate-600">@{order.store?.username || 'N/A'}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                      order.store?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      order.store?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.store?.status || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{order.store?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="font-medium">{order.store?.contact || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium">{order.store?.address || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="font-medium">
                      {order.store?.memberSince 
                        ? new Date(order.store.memberSince).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Order Items & Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Items</h2>
                
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-slate-100 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                          {item.product?.images?.[0] ? (
                            <Image 
                              width={64} 
                              height={64} 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="rounded-xl object-cover w-full h-full"
                            />
                          ) : (
                            <PackageIcon className="text-gray-400" size={24} />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800">{item.product?.name || 'N/A'}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-slate-500">Quantity</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-slate-500">Unit Price</p>
                            <p className="font-medium">{formatCurrency(item.unitPrice)}</p>
                          </div>
                          
                          {item.selectedColor && (
                            <div>
                              <p className="text-xs text-slate-500">Color</p>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-slate-200" 
                                  style={{ backgroundColor: item.selectedColor }}
                                ></div>
                                <span className="font-medium">{item.selectedColor}</span>
                              </div>
                            </div>
                          )}
                          
                          {item.selectedSize && (
                            <div>
                              <p className="text-xs text-slate-500">Size</p>
                              <p className="font-medium">{item.selectedSize}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(item.lineTotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-slate-600">Subtotal</p>
                      <p className="font-medium">{formatCurrency(order.analytics?.subtotal)}</p>
                    </div>
                    
                    {order.analytics?.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-slate-600">Discount</p>
                        <p className="font-medium text-red-600">-{formatCurrency(order.analytics.discountAmount)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <p className="font-semibold text-slate-800">Total</p>
                      <p className="font-bold text-lg">{formatCurrency(order.analytics?.finalTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPinIcon size={20} />
                  Delivery Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Recipient</p>
                    <p className="font-medium">{order.deliveryAddress?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{order.deliveryAddress?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium">{order.deliveryAddress?.street || 'N/A'}</p>
                    <p className="font-medium">
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state}, {order.deliveryAddress?.zip}
                    </p>
                    <p className="font-medium">{order.deliveryAddress?.country || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{order.deliveryAddress?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
            <PackageIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Order not found</h3>
            <p className="text-gray-500">The requested order could not be found.</p>
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