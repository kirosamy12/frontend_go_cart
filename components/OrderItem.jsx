'use client'
import Image from "next/image";
import { DotIcon, PackageIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState, useEffect } from "react";
import RatingModal from "./RatingModal";
import { useRouter } from "next/navigation";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const router = useRouter();

    const { ratings } = useSelector(state => state.rating);

    const handleRowClick = () => {
        router.push(`/orders/${order.id || order._id}`)
    }

    // Format date
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return 'Invalid Date';
        }
    }

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'text-green-600 bg-green-100';
            case 'confirmed':
                return 'text-blue-600 bg-blue-100';
            case 'processing':
                return 'text-yellow-600 bg-yellow-100';
            case 'shipped':
                return 'text-indigo-600 bg-indigo-100';
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-slate-600 bg-slate-100';
        }
    }

    return (
        <>
            <tr 
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={handleRowClick}
            >
                <td className="py-6 px-6">
                    <div className="flex flex-col gap-4">
                        {(order.orderItems || []).map((item, index) => {
                            const productId = item.productId || item.product?.id;
                            const productName = item.product?.name || item.name || 'Product Name';
                            const productImage = item.product?.images?.[0] || item.image || '/assets/product_img1.png';

                            return (
                                <div key={`${order.id || order._id}-${index}`} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg overflow-hidden">
                                        <Image
                                            className="object-contain w-full h-full"
                                            src={productImage}
                                            alt={productName}
                                            width={64}
                                            height={64}
                                            onError={(e) => {
                                                e.target.src = '/assets/product_img1.png';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{productName}</p>
                                        <p className="text-sm text-slate-600">{currency}{item.price} × {item.quantity}</p>
                                        <p className="text-xs text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
                                        <div className="mt-2">
                                            {productId && ratings.find(rating => order.id === rating.orderId && productId === rating.productId)
                                                ? <Rating value={ratings.find(rating => order.id === rating.orderId && productId === rating.productId).rating} />
                                                : productId && (
                                                    <button 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            setRatingModal({ orderId: order.id, productId: productId }); 
                                                        }} 
                                                        className={`text-indigo-600 hover:text-indigo-800 text-sm font-medium ${order.status !== "DELIVERED" && 'hidden'}`}
                                                    >
                                                        Rate Product
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </td>

                <td className="py-6 px-6 text-center max-md:hidden">
                    <p className="font-semibold text-slate-800 text-lg">{currency}{order.total || '0'}</p>
                </td>

                <td className="py-6 px-6 max-md:hidden">
                    {order.address ? (
                        <div className="text-sm">
                            <p className="font-medium text-slate-800">{order.address.name}</p>
                            <p className="text-slate-600">{order.address.street}</p>
                            <p className="text-slate-600">{order.address.city}, {order.address.state}</p>
                            <p className="text-slate-600">{order.address.phone}</p>
                        </div>
                    ) : (
                        <p className="text-slate-500">Address not available</p>
                    )}
                </td>

                <td className="py-6 px-6 max-md:hidden">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <PackageIcon size={14} />
                        {(order.status || 'pending').split('_').join(' ').toLowerCase()}
                    </span>
                </td>
            </tr>
            
            {/* Mobile view */}
            <tr className="md:hidden border-b border-slate-200 bg-slate-50">
                <td colSpan={4} className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                <PackageIcon size={12} />
                                {(order.status || 'pending').split('_').join(' ').toLowerCase()}
                            </span>
                            <span className="font-semibold text-slate-800">{currency}{order.total || '0'}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                            {order.address ? (
                                <>
                                    <p>{order.address.name}</p>
                                    <p>{order.address.city}, {order.address.state}</p>
                                </>
                            ) : (
                                <p>Address not available</p>
                            )}
                        </div>
                    </div>
                </td>
            </tr>
            
            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </>
    )
}

export default OrderItem