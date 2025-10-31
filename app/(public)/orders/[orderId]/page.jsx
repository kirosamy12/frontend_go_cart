'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { getOrderById } from '@/lib/features/orders/ordersSlice'
import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import { DotIcon, MapPinIcon, CreditCardIcon, CalendarIcon } from 'lucide-react'

const OrderDetailsPage = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const { currentOrder, loading, error } = useSelector(state => state.orders)
    const { token } = useSelector(state => state.auth)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {
        if (token && orderId) {
            dispatch(getOrderById(orderId))
        }
    }, [token, orderId, dispatch])

    if (loading) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <div className="text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Loading order...</h1>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <div className="text-red-500">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Error: {error}</h1>
                </div>
            </div>
        )
    }

    if (!currentOrder) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <div className="text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Order not found</h1>
                </div>
            </div>
        )
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'text-green-600 bg-green-100'
            case 'confirmed':
                return 'text-yellow-600 bg-yellow-100'
            case 'pending':
                return 'text-blue-600 bg-blue-100'
            case 'cancelled':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-slate-600 bg-slate-100'
        }
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="my-20 max-w-7xl mx-auto">
                <PageTitle heading="Order Details" text={`Order ID: ${currentOrder.id || currentOrder._id}`} linkText={'Back to orders'} linkHref={'/orders'} />

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">Order Information</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                                    {currentOrder.status?.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-slate-400" />
                                    <span className="text-slate-600">Order Date:</span>
                                    <span className="font-medium">
                                        {(() => {
                                            try {
                                                return new Date(currentOrder.createdAt).toLocaleDateString();
                                            } catch (error) {
                                                return 'Invalid date';
                                            }
                                        })()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon size={16} className="text-slate-400" />
                                    <span className="text-slate-600">Payment:</span>
                                    <span className="font-medium">{currentOrder.paymentMethod || 'Cash on Delivery'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {(currentOrder.orderItems || []).map((item, index) => {
                                    const productId = item.productId || item.product?.id
                                    const productName = item.product?.name || item.name || 'Product Name'
                                    const productImage = item.product?.images?.[0] || item.image || '/assets/product_img1.png'

                                    return (
                                        <div key={index} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
                                            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg">
                                                <Image
                                                    className="h-12 w-auto"
                                                    src={productImage}
                                                    alt="product_img"
                                                    width={48}
                                                    height={48}
                                                    onError={(e) => {
                                                        e.target.src = '/assets/product_img1.png'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-slate-800">{productName}</h3>
                                                <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-medium text-slate-700">{currency}{item.price} each</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-800">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Address */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal:</span>
                                    <span className="font-medium">{currency}{(currentOrder.total - (currentOrder.shipping || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Shipping:</span>
                                    <span className="font-medium">{currency}{(currentOrder.shipping || 0).toFixed(2)}</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-slate-800">Total:</span>
                                    <span className="text-slate-800">{currency}{currentOrder.total?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <MapPinIcon size={20} className="text-slate-400" />
                                Shipping Address
                            </h2>
                            {currentOrder.address ? (
                                <div className="text-sm space-y-1">
                                    <p className="font-medium text-slate-800">{currentOrder.address.name}</p>
                                    <p className="text-slate-600">{currentOrder.address.street}</p>
                                    <p className="text-slate-600">
                                        {currentOrder.address.city}, {currentOrder.address.state} {currentOrder.address.zip}
                                    </p>
                                    <p className="text-slate-600">{currentOrder.address.country}</p>
                                    <p className="text-slate-600 font-medium">{currentOrder.address.phone}</p>
                                </div>
                            ) : (
                                <p className="text-slate-500">Address not available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsPage
