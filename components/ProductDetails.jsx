'use client'

import { addToCartAsync } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {

    const productId = product?.id || product?._id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cartItems = useSelector(state => state.cart.items || {});
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState('/placeholder-image.jpg');

    // Set main image when product changes
    useEffect(() => {
        if (product?.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    const addToCartHandler = () => {
        if (productId) {
            dispatch(addToCartAsync({ productId, quantity: 1 }))
        }
    }

    const averageRating = product?.rating && product.rating.length > 0 ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length : 0;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product?.images && product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                            <Image src={image || '/placeholder-image.jpg'} className="group-hover:scale-105 transition-transform duration-200 rounded" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    <Image src={mainImage || '/placeholder-image.jpg'} alt={product?.name || 'Product'} width={250} height={250} className="object-contain hover:scale-105 transition-transform duration-300" />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product?.name || 'Product Name'}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product?.rating && product.rating.length > 0 ? product.rating.length : 0} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product?.price || '0'} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product?.mrp || '0'}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {product?.mrp && product?.price ? ((product.mrp - product.price) / product.mrp * 100).toFixed(0) : 0}% right now</p>
                </div>
                <div className="flex items-end gap-5 mt-10">
                    {
                        cartItems[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }
                    <button onClick={() => !cartItems[productId] ? addToCartHandler() : router.push('/cart')} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                        {!cartItems[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
