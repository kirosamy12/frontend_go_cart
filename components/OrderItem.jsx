'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
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

    // Debug: log the order data to see what we're receiving
    useEffect(() => {
        console.log('Order data:', order)
        console.log('Order items:', order?.orderItems)
        console.log('Order address:', order?.address)
    }, [order])

    const handleRowClick = () => {
        router.push(`/orders/${order.id || order._id}`)
    }

    return (
        <>
        <tr className="text-sm cursor-pointer hover:bg-slate-50 transition" onClick={handleRowClick} style={{cursor: 'pointer'}}>
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {(order.orderItems || []).map((item, index) => {
                            const productId = item.productId || item.product?.id;
                            const productName = item.product?.name || item.name || 'Product Name';
                            const productImage = item.product?.images?.[0] || item.image || '/assets/product_img1.png';

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                        <Image
                                            className="h-14 w-auto"
                                            src={productImage}
                                            alt="product_img"
                                            width={50}
                                            height={50}
                                            onError={(e) => {
                                                e.target.src = '/assets/product_img1.png';
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center text-sm">
                                        <p className="font-medium text-slate-600 text-base">{productName}</p>
                                        <p>{currency}{item.price} Qty : {item.quantity} </p>
                                        <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                        <div>
                                            {productId && ratings.find(rating => order.id === rating.orderId && productId === rating.productId)
                                                ? <Rating value={ratings.find(rating => order.id === rating.orderId && productId === rating.productId).rating} />
                                                : productId && <button onClick={(e) => { e.stopPropagation(); setRatingModal({ orderId: order.id, productId: productId }); }} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                            }</div>
                                        {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total || '0'}</td>

                <td className="text-left max-md:hidden">
                    {order.address ? (
                        <>
                            <p>{order.address.name}, {order.address.street},</p>
                            <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                            <p>{order.address.phone}</p>
                        </>
                    ) : (
                        <p>Address not available</p>
                    )}
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 ${order.status === 'confirmed'
                            ? 'text-yellow-500 bg-yellow-100'
                            : order.status === 'delivered'
                                ? 'text-green-500 bg-green-100'
                                : 'text-slate-500 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {(order.status || 'pending').split('_').join(' ').toLowerCase()}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden cursor-pointer" onClick={handleRowClick}>
                <td colSpan={5}>
                    {order.address ? (
                        <>
                            <p>{order.address.name}, {order.address.street}</p>
                            <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                            <p>{order.address.phone}</p>
                        </>
                    ) : (
                        <p>Address not available</p>
                    )}
                    <br />
                    <div className="flex items-center">
                        <span className='text-center mx-auto px-6 py-1.5 rounded bg-green-100 text-green-700' >
                            {(order.status || 'pending').replace(/_/g, ' ').toLowerCase()}
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem