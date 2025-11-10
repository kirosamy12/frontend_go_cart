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
        <Link href={`/product/${product?.id || product?._id}`} className='group relative'>
            <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col'>
                {/* Product image container */}
                <div className='relative h-48 flex items-center justify-center p-4'>
                    <Image 
                        width={500} 
                        height={500} 
                        className='max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-300' 
                        src={product?.images && product.images[0] ? product.images[0] : '/assets/product_img1.png'} 
                        alt={product?.name || 'Product'} 
                    />
                    
                    {/* Wishlist button */}
                    <button 
                        onClick={handleWishlistToggle} 
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${
                            isInWishlist 
                                ? 'text-red-500 bg-white' 
                                : 'text-gray-400 bg-white hover:text-red-500'
                        }`}
                    >
                        <HeartIcon size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                    </button>
                    
                    {/* Image indicators */}
                    {product?.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex gap-1">
                            {product.images.slice(0, 3).map((_, index) => (
                                <div key={index} className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                            ))}
                            {product.images.length > 3 && (
                                <span className="text-xs text-white bg-black bg-opacity-50 px-1.5 py-0.5 rounded-full">
                                    +{product.images.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Sale badge */}
                    {product?.mrp && product?.price && product.mrp > product.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </div>
                    )}
                    

                </div>
                
                {/* Product info */}
                <div className='p-4 flex-1 flex flex-col'>
                    <div className='flex-1'>
                        <h3 className="font-semibold text-slate-800 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                            {product?.name || 'Product Name'}
                        </h3>
                        
                        {/* Rating */}
                        <div className='flex items-center gap-1 mb-2'>
                            <div className='flex'>
                                {Array(5).fill('').map((_, index) => (
                                    <StarIcon 
                                        key={index} 
                                        size={14} 
                                        className='text-transparent' 
                                        fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} 
                                    />
                                ))}
                            </div>
                            <span className='text-xs text-slate-500 ml-1'>
                                {product?.rating?.length || 0} reviews
                            </span>
                        </div>
                        
                        {/* Colors and Sizes */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {product?.colors && product.colors.length > 0 && (
                                <div className="flex gap-1">
                                    {product.colors.slice(0, 3).map((color, index) => (
                                        <div 
                                            key={index} 
                                            className="w-3 h-3 rounded-full border border-slate-300"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        ></div>
                                    ))}
                                    {product.colors.length > 3 && (
                                        <span className="text-xs text-slate-500">+{product.colors.length - 3}</span>
                                    )}
                                </div>
                            )}
                            
                            {product?.sizes && product.sizes.length > 0 && (
                                <div className="flex gap-1">
                                    {product.sizes.slice(0, 3).map((size, index) => (
                                        <div key={index} className="text-xs px-1.5 py-0.5 bg-slate-100 rounded">
                                            {size}
                                        </div>
                                    ))}
                                    {product.sizes.length > 3 && (
                                        <span className="text-xs text-slate-500">+{product.sizes.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Price and stock status */}
                    <div className='flex items-center justify-between mt-2'>
                        <div>
                            <p className="font-bold text-slate-800">
                                {currency}{product?.price || '0'}
                                {product?.mrp && product.mrp > product.price && (
                                    <span className="text-sm text-slate-500 line-through font-normal ml-2">
                                        {currency}{product.mrp}
                                    </span>
                                )}
                            </p>
                        </div>
                        
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            product?.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {product?.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard