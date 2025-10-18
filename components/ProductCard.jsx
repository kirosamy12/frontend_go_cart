'use client'
import { StarIcon, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'

const ProductCard = ({ product }) => {

    const dispatch = useDispatch()
    const { wishlistItems } = useSelector(state => state.wishlist)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = product?.rating && product.rating.length > 0
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0;

    const isInWishlist = wishlistItems.includes(product?.id || product?._id)

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        if (isInWishlist) {
            dispatch(removeFromWishlist({ productId: product?.id || product?._id }))
        } else {
            dispatch(addToWishlist({ productId: product?.id || product?._id }))
        }
    }

    return (
        <Link href={`/product/${product?.id || product?._id}`} className=' group max-xl:mx-auto relative'>
            <div className='bg-gradient-to-br from-gray-50 to-gray-100 h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto object-contain group-hover:scale-110 transition-transform duration-300' src={product?.images && product.images[0] ? product.images[0] : '/assets/product_img1.png'} alt={product?.name || 'Product'} />
                <button onClick={handleWishlistToggle} className={`absolute top-2 right-2 p-1.5 rounded-full transition-all shadow-sm ${isInWishlist ? 'text-red-500 bg-white' : 'text-gray-400 bg-white hover:text-red-500'}`}>
                    <HeartIcon size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
                </button>
                {product?.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                        {product.images.slice(0, 3).map((_, index) => (
                            <div key={index} className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                        ))}
                        {product.images.length > 3 && (
                            <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">+{product.images.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p className="font-medium truncate">{product?.name || 'Product Name'}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p className="font-semibold">{currency}{product?.price || '0'}</p>
            </div>
            <div className="mt-1 text-xs font-semibold">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>
        </Link>
    )
}

export default ProductCard
