'use client'
import { useEffect, useState } from "react"
import ModernLoading from "@/components/ModernLoading"
import { TruckIcon, PackageIcon, CheckCircleIcon, ClockIcon } from "lucide-react"

const OrderTracking = ({ orderId, token }) => {
    const [trackingData, setTrackingData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTrackingData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            if (!token || !orderId) {
                throw new Error('Missing required parameters: token or orderId')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/order/${orderId}/tracking`, {
                headers: {
                    'token': token,
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get tracking data')
            
            setTrackingData(data.tracking)
        } catch (error) {
            console.error('Error fetching tracking data:', error)
            setError(error.message || 'Failed to fetch tracking data. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId && token) {
            fetchTrackingData()
        }
    }, [orderId, token])

    const getStatusClass = (status) => {
        switch (status) {
            case 'ORDER_PLACED':
                return 'bg-blue-100 text-blue-800'
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800'
            case 'SHIPPED':
                return 'bg-indigo-100 text-indigo-800'
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ORDER_PLACED':
                return <ClockIcon size={20} />
            case 'PROCESSING':
                return <PackageIcon size={20} />
            case 'SHIPPED':
                return <TruckIcon size={20} />
            case 'DELIVERED':
                return <CheckCircleIcon size={20} />
            default:
                return <ClockIcon size={20} />
        }
    }

    if (loading) return <ModernLoading />

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Tracking Data</h3>
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
                    
                    <button
                        onClick={fetchTrackingData}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!trackingData) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Tracking Data Not Found</h3>
                    <p className="text-gray-500">The requested tracking data could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Order Tracking</h2>
            
            <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Current Status</p>
                            <p className="text-lg font-semibold text-slate-800">{trackingData.currentStatus}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(trackingData.currentStatus)}`}>
                            {getStatusIcon(trackingData.currentStatus)}
                            <span className="ml-2">{trackingData.currentStatus.replace('_', ' ')}</span>
                        </span>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Tracking Timeline</h3>
                    <div className="space-y-4">
                        {trackingData.timeline && trackingData.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    event.status === trackingData.currentStatus 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {getStatusIcon(event.status)}
                                </div>
                                <div className="flex-1 pb-4 border-l-2 border-slate-200 pl-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-slate-800">{event.status.replace('_', ' ')}</h4>
                                        <span className="text-sm text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Information */}
                {trackingData.shippingInfo && (
                    <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Shipping Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Carrier</p>
                                <p className="font-medium">{trackingData.shippingInfo.carrier || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Tracking Number</p>
                                <p className="font-medium">{trackingData.shippingInfo.trackingNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Estimated Delivery</p>
                                <p className="font-medium">
                                    {trackingData.shippingInfo.estimatedDelivery 
                                        ? new Date(trackingData.shippingInfo.estimatedDelivery).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderTracking