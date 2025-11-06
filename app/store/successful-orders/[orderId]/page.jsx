'use client'
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSelector } from "react-redux"
import Loading from "@/components/Loading"

export default function SuccessfulOrderDetails() {
    const router = useRouter()
    const params = useParams()
    const { orderId } = params
    const { token } = useSelector(state => state.auth)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrderDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Debug logging
            console.log('Fetching order details with token:', token ? 'Token present' : 'No token')
            console.log('Order ID:', orderId)
            
            // Check if token exists
            if (!token) {
                throw new Error('No authentication token found. Please log in again.')
            }
            
            // Add a timeout to the fetch request
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

            // Use the new endpoint for a single successful order
            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/orders/successful/${orderId}`, {
                method: 'GET',
                headers: {
                    'token': token,
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            console.log('Response status:', response.status)
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.log('Error response data:', errorData)
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('Success response data:', data)
            if (!data.success) throw new Error(data.message || 'Failed to get order details')
            
            setOrder(data.order || null)
        } catch (error) {
            console.error('Error fetching order details:', error)
            // Provide more specific error messages
            if (error.name === 'AbortError') {
                setError('Request timeout. Please check your internet connection and try again.')
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                setError('Unable to connect to the server. Please check your internet connection and ensure the API server is running. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/orders/successful/:orderId')
            } else {
                setError(error.message || 'Failed to fetch order details. Please try again later.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token && orderId) {
            fetchOrderDetails()
        }
    }, [token, orderId])

    const formatCurrency = (amount) => {
        // Handle potential null or undefined values
        if (!amount && amount !== 0) return 'N/A'
        
        // Assuming amounts are in cents, convert to dollars
        const dollars = amount / 100
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(dollars)
    }

    const formatDate = (dateString) => {
        // Handle potential null or undefined values
        if (!dateString) return 'N/A'
        
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch (e) {
            return 'Invalid Date'
        }
    }

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Order Details</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 font-medium mb-2">Troubleshooting Tips:</p>
                            <ul className="text-left text-sm text-yellow-700 space-y-1 max-w-md mx-auto">
                                <li key="tip1">• Check your internet connection</li>
                                <li key="tip2">• Verify the API server is running</li>
                                <li key="tip3">• Try refreshing the page</li>
                                <li key="tip4">• Ensure you have proper permissions</li>
                            </ul>
                        </div>
                        
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={fetchOrderDetails}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/store/successful-orders')}
                                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-12">
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Order Not Found</h3>
                        <p className="text-gray-500">The requested order could not be found.</p>
                        <button
                            onClick={() => router.push('/store/successful-orders')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl text-slate-800 font-semibold">Order <span className="text-blue-600">Details</span></h1>
                <button
                    onClick={() => router.push('/store/successful-orders')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                    Back to Orders
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Order Details</h2>
                            <p className="text-slate-600 mt-1">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {order.status}
                            </span>
                            {order.isPaid ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Paid
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    Unpaid
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Customer Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h3>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="font-medium">{order.customer?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium">{order.customer?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.address && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Shipping Address</h3>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Street</p>
                                        <p className="font-medium">{order.address.street || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">City</p>
                                        <p className="font-medium">{order.address.city || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">State</p>
                                        <p className="font-medium">{order.address.state || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Country</p>
                                        <p className="font-medium">{order.address.country || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Phone</p>
                                        <p className="font-medium">{order.address.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Items</h3>
                            <div className="bg-slate-50 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Color
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.orderItems.map((item, index) => (
                                            <tr key={`${orderId}-${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {item.product?.images?.[0] && (
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                                                                <img 
                                                                    src={item.product.images[0]} 
                                                                    alt={item.product.name} 
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.style.background = '#f3f4f6';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{item.product?.name || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.selectedColor ? (
                                                        <div className="flex items-center">
                                                            <div 
                                                                className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                                                                style={{ backgroundColor: item.selectedColor }}
                                                            ></div>
                                                            <span>{item.selectedColor}</span>
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.quantity || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(item.lineTotal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Payment Method</p>
                                    <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Order Date</p>
                                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                                </div>
                                {order.deliveredAt && (
                                    <div>
                                        <p className="text-sm text-slate-500">Delivered Date</p>
                                        <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-500">Total Amount</p>
                                    <p className="font-medium text-lg">{formatCurrency(order.total)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/store/successful-orders')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}