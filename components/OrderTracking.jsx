'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOrderTracking } from "@/lib/features/orders/ordersSlice"
import Loading from "@/components/Loading"

export default function OrderTracking({ orderId, onClose }) {
    const dispatch = useDispatch()
    const { orderTracking, loading, error } = useSelector(state => state.orders)
    const [hasFetched, setHasFetched] = useState(false)

    useEffect(() => {
        if (orderId && !hasFetched && !orderTracking) {
            dispatch(getOrderTracking(orderId))
            setHasFetched(true)
        }
    }, [orderId, hasFetched, orderTracking, dispatch])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading tracking: {error}</p>
                <button
                    onClick={() => {
                        dispatch(getOrderTracking(orderId))
                        setHasFetched(true)
                    }}
                    className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (!orderTracking) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                        Order Tracking - #{orderId}
                    </h2>
                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">Loading tracking information...</p>
                        {!hasFetched && (
                            <p className="text-sm text-slate-400">Fetching data from server...</p>
                        )}
                        {hasFetched && !loading && (
                            <p className="text-sm text-slate-400">No tracking information available for this order.</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-700'
            case 'processing': return 'bg-yellow-100 text-yellow-700'
            case 'shipped': return 'bg-blue-100 text-blue-700'
            case 'delivered': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return 'bg-green-500'
        if (percentage >= 50) return 'bg-blue-500'
        if (percentage >= 25) return 'bg-yellow-500'
        return 'bg-gray-500'
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                    Order Tracking - #{orderTracking.orderId}
                </h2>

                {/* Store Information */}
                {orderTracking.store && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            {orderTracking.store.logo && (
                                <img
                                    src={orderTracking.store.logo}
                                    alt={orderTracking.store.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-800">{orderTracking.store.name}</h3>
                                <p className="text-slate-600">@{orderTracking.store.username}</p>
                                {orderTracking.store.contact && (
                                    <p className="text-slate-600 text-sm">📞 {orderTracking.store.contact}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Summary */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-slate-500 text-xs uppercase">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderTracking.currentStatus)}`}>
                                {orderTracking.currentStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase">Progress</p>
                            <p className="font-medium">{orderTracking.progressPercentage}%</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase">Total</p>
                            <p className="font-medium">${orderTracking.total}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase">Payment</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                                orderTracking.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {orderTracking.isPaid ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(orderTracking.progressPercentage)}`}
                            style={{ width: `${orderTracking.progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-slate-600 mt-2">
                        {orderTracking.progressPercentage}% Complete
                    </p>
                </div>

                {/* Tracking Steps */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-4 text-slate-800">Order Progress</h3>
                    <div className="space-y-4">
                        {orderTracking.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.completed
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step.completed ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <span className="text-xs font-medium">{index + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${step.completed ? 'text-green-700' : 'text-slate-700'}`}>
                                        {step.label}
                                    </h4>
                                    <p className="text-slate-600 text-sm">{step.description}</p>
                                    {step.timestamp && (
                                        <p className="text-slate-500 text-xs mt-1">
                                            {(() => {
                                                try {
                                                    return new Date(step.timestamp).toLocaleString();
                                                } catch (error) {
                                                    return 'Invalid date';
                                                }
                                            })()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Information */}
                {orderTracking.deliveryAddress && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold mb-3 text-slate-800">Delivery Address</h3>
                        <div className="text-slate-600">
                            <p>{orderTracking.deliveryAddress.street}</p>
                            <p>{orderTracking.deliveryAddress.city}, {orderTracking.deliveryAddress.state} {orderTracking.deliveryAddress.zip || ''}</p>
                            <p>{orderTracking.deliveryAddress.country}</p>
                            {orderTracking.deliveryAddress.phone && (
                                <p className="mt-2">📞 {orderTracking.deliveryAddress.phone}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Estimated Delivery */}
                {orderTracking.estimatedDelivery && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2 text-blue-800">Estimated Delivery</h3>
                        <p className="text-blue-700">
                            {(() => {
                                try {
                                    return new Date(orderTracking.estimatedDelivery).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    });
                                } catch (error) {
                                    return 'Invalid date';
                                }
                            })()}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
