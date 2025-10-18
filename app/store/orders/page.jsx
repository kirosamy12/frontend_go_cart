'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/Loading"
import OrderTracking from "@/components/OrderTracking"
import { getStoreOrders, updateOrderStatus } from "@/lib/features/orders/ordersSlice"

export default function StoreOrders() {
    const dispatch = useDispatch()
    const { storeOrders, loading, error } = useSelector(state => state.orders)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTrackingOpen, setIsTrackingOpen] = useState(false)

    const fetchOrders = async () => {
        dispatch(getStoreOrders())
    }

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await dispatch(updateOrderStatus({ orderId, status })).unwrap()
        } catch (error) {
            console.error('Failed to update order status:', error)
            // You might want to show a toast notification here
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    const openTracking = (orderId) => {
        setSelectedOrder({ id: orderId })
        setIsTrackingOpen(true)
    }

    const closeTracking = () => {
        setSelectedOrder(null)
        setIsTrackingOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [dispatch])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading orders: {error}</p>
                <button
                    onClick={fetchOrders}
                    className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-3xl text-slate-800 font-semibold mb-5">Store <span className="text-blue-600">Orders</span></h1>
            {storeOrders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto max-w-6xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {storeOrders.map((order, index) => (
                                <tr
                                    key={order.id || order._id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-6 text-green-600" >
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">{order.customer?.name}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">${order.total}</td>
                                    <td className="px-4 py-3">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        {order.isCouponUsed ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                {order.coupon?.code}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => handleUpdateOrderStatus(order.id || order._id, e.target.value)}
                                            className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200"
                                        >
                                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Enhanced Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50" >
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                            Order Details - #{selectedOrder.id || selectedOrder._id}
                        </h2>

                        {/* Order Summary */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Order ID</p>
                                    <p className="font-medium">{selectedOrder.id || selectedOrder._id}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        selectedOrder.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-700' :
                                        selectedOrder.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Total</p>
                                    <p className="font-medium">${selectedOrder.total}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Payment Method</p>
                                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Customer Information</h3>
                            <p><strong>Name:</strong> {selectedOrder.customer?.name}</p>
                            <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                            <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Order Items</h3>
                            <ul className="list-disc list-inside">
                                {selectedOrder.items?.map(item => (
                                    <li key={item.id}>
                                        {item.name} - Quantity: {item.quantity} - Price: ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
                    </div>
                </div>
            )}

            {/* Order Tracking Modal */}
            {isTrackingOpen && selectedOrder && (
                <OrderTracking orderId={selectedOrder.id} onClose={closeTracking} />
            )}
        </>
    )
}
