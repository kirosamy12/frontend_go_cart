'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import ModernLoading from "@/components/ModernLoading"

export default function SuccessfulOrderDetails() {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [localError, setLocalError] = useState(null)

    const fetchOrder = async () => {
        try {
            setLoading(true)
            setLocalError(null)
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            if (!orderId) {
                throw new Error('Order ID is required')
            }

            // Add a timeout to the fetch request
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/orders/successful/${orderId}`, {
                method: 'GET',
                headers: {
                    'token': token,
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get order')
            
            setOrder(data.order)
        } catch (error) {
            console.error('Error fetching order:', error)
            // Provide more specific error messages
            if (error.name === 'AbortError') {
                setLocalError('Request timeout. Please check your internet connection and try again.')
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                setLocalError('Unable to connect to the server. Please check your internet connection and ensure the API server is running. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/orders/successful/:orderId')
            } else if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                console.error('CORS error or network issue:', error);
                setLocalError('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/orders/successful/:orderId');
            } else {
                setLocalError(error.message || 'Failed to fetch order. Please try again later.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId) {
            fetchOrder()
        }
    }, [orderId])

    const formatCurrency = (amount) => {
        // Handle potential null or undefined values
        if (!amount && amount !== 0) return 'N/A';
        
        // Ensure amount is a number
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return 'N/A';
        
        // Check if the amount is a whole number
        if (Number.isInteger(numericAmount)) {
            // For whole numbers, display without decimals
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EGP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(numericAmount);
        } else {
            // For decimal numbers, display with 2 decimal places
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EGP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericAmount);
        }
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

    // Show local error if exists, otherwise show Redux error
    const displayError = localError || error

    if (loading) return <ModernLoading />

    if (displayError) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Order</h3>
                        <p className="text-red-700 mb-4">{displayError}</p>
                        
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
                                onClick={fetchOrder}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <Link 
                                href="/store/successful-orders"
                                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <ArrowLeftIcon size={18} />
                                Back to Orders
                            </Link>
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
                        <Link 
                            href="/store/successful-orders"
                            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            <ArrowLeftIcon size={18} />
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <Link 
                    href="/store/successful-orders"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    <ArrowLeftIcon size={18} />
                    Back to Orders
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
                            <p className="text-slate-600 mt-1">
                                Order #{order.id?.substring(0, 8)} • Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Information */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Information</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500">Order ID</p>
                                            <p className="font-medium">#{order.id?.substring(0, 8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Order Date</p>
                                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Status</p>
                                            <p className="font-medium">{order.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Payment Method</p>
                                            <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Items</h2>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Unit Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.items && order.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                                {item.selectedColor && (
                                                                    <div className="flex items-center mt-1">
                                                                        <span className="text-xs text-gray-500 mr-2">Color:</span>
                                                                        <span 
                                                                            className="inline-block w-4 h-4 rounded-full border border-gray-300" 
                                                                            style={{ backgroundColor: item.selectedColor }}
                                                                        ></span>
                                                                        <span className="text-xs text-gray-500 ml-1">{item.selectedColor}</span>
                                                                    </div>
                                                                )}
                                                                {item.selectedSize && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Size: {item.selectedSize}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(item.unitPrice)}
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
                        </div>

                        {/* Customer & Payment Information */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-slate-500">Name</p>
                                            <p className="font-medium">{order.customer?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Email</p>
                                            <p className="font-medium">{order.customer?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Phone</p>
                                            <p className="font-medium">{order.customer?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Shipping Address</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-slate-500">Address</p>
                                            <p className="font-medium">{order.shippingAddress?.street || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">City</p>
                                            <p className="font-medium">{order.shippingAddress?.city || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Country</p>
                                            <p className="font-medium">{order.shippingAddress?.country || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Postal Code</p>
                                            <p className="font-medium">{order.shippingAddress?.postalCode || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Summary</h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-slate-600">Subtotal</p>
                                        <p className="font-medium">{formatCurrency(order.subtotal)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-slate-600">Shipping</p>
                                        <p className="font-medium">{formatCurrency(order.shippingCost || 0)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-slate-600">Tax</p>
                                        <p className="font-medium">{formatCurrency(order.tax)}</p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <p className="text-slate-600 font-medium">Total</p>
                                        <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}