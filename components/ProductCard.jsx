'use client'
import { StarIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { getColorName } from '@/lib/utils/colorUtils'

const ProductCard = ({ product }) => {

    const dispatch = useDispatch()
    const { wishlistItems } = useSelector(state => state.wishlist)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'

    // ✅ استخدام useMemo للحسابات
    const rating = useMemo(() => {
        if (!product?.rating || product.rating.length === 0) return 0;
        const sum = product.rating.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / product.rating.length).toFixed(1);
    }, [product?.rating]);

    const discountPercentage = useMemo(() => {
        if (!product?.mrp || !product?.price || product.mrp <= product.price) return 0;
        return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }, [product?.mrp, product?.price]);

    const isInWishlist = wishlistItems.includes(product?.id || product?._id)

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isInWishlist) {
            dispatch(removeFromWishlist({ productId: product?.id || product?._id }))
        } else {
            dispatch(addToWishlist({ productId: product?.id || product?._id }))
        }
    }

    // ✅ تحسين دالة getSizes
    const sizes = useMemo(() => {
        if (!product) return [];
        
        const sizeData = product.sizes || product.size;
        
        if (Array.isArray(sizeData)) {
            return sizeData;
        }
        
        if (typeof sizeData === 'string') {
            try {
                const parsed = JSON.parse(sizeData);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return sizeData.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        
        return [];
    }, [product]);

    // ✅ تحسين دالة getScents
    const scents = useMemo(() => {
        if (!product) return [];
        
        const scentData = product.scents || product.scent;
        
        if (Array.isArray(scentData)) {
            return scentData;
        }
        
        if (typeof scentData === 'string') {
            try {
                const parsed = JSON.parse(scentData);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return scentData.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        
        return [];
    }, [product]);

    // ✅ Get stock quantity for display
    const getTotalQuantity = () => {
        if (product?.sizeQuantities) {
            return Object.values(product.sizeQuantities).reduce((sum, qty) => sum + qty, 0);
        }
        return null;
    };

    const totalQuantity = getTotalQuantity();

    return (
        <Link 
            href={`/product/${product?.id || product?._id}`} 
            className='group relative block'
            suppressHydrationWarning
        >
            <div className='bg-gradient-to-br from-white to-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-slate-100'>
                {/* Product image container */}
                <div className='relative h-48 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100'>
                    <Image 
                        width={500} 
                        height={500} 
                        className='max-h-40 w-auto object-contain group-hover:scale-110 transition-transform duration-500' 
                        src={product?.images && product.images[0] ? product.images[0] : '/assets/product_img1.png'} 
                        alt={product?.name || 'Product'} 
                        loading="lazy"
                    />
                    
                    {/* Wishlist button */}
                    <button 
                        onClick={handleWishlistToggle} 
                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-md hover:scale-110 z-10 ${
                            isInWishlist 
                                ? 'text-red-500 bg-white ring-2 ring-red-200' 
                                : 'text-slate-400 bg-white hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <HeartIcon size={18} fill={isInWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
                    </button>
                    
                    {/* Image indicators */}
                    {product?.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {product.images.slice(0, 3).map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === 0 ? 'bg-indigo-500' : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                            {product.images.length > 3 && (
                                <span className="text-xs text-slate-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                                    +{product.images.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Sale badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {discountPercentage}% OFF
                        </div>
                    )}
                    
                    {/* Quick add to cart (appears on hover) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add to cart logic here
                            }}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
                            aria-label="Quick add to cart"
                        >
                            <ShoppingCartIcon size={16} />
                        </button>
                    </div>
                </div>
                
                {/* Product info */}
                <div className='p-4 flex-1 flex flex-col'>
                    <div className='flex-1'>
                        <h3 className="font-semibold text-slate-800 truncate mb-1 group-hover:text-indigo-600 transition-colors text-base">
                            {product?.name || 'Product Name'}
                        </h3>
                        
                        {/* Rating */}
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='flex'>
                                {Array(5).fill('').map((_, index) => (
                                    <StarIcon 
                                        key={index} 
                                        size={14} 
                                        className='text-transparent' 
                                        fill={parseFloat(rating) >= index + 1 ? "#fbbf24" : "#D1D5DB"} 
                                    />
                                ))}
                            </div>
                            <span className='text-xs text-slate-600 font-medium'>
                                {rating} ({product?.rating?.length || 0})
                            </span>
                        </div>
                        
                        {/* Options: Colors, Sizes, and Scents */}
                        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
                            {/* Colors */}
                            {product?.colors && product.colors.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {product.colors.slice(0, 3).map((color, index) => (
                                        <div 
                                            key={index} 
                                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                                            style={{ backgroundColor: color }}
                                            title={getColorName(color)}
                                        />
                                    ))}
                                    {product.colors.length > 3 && (
                                        <span className="text-xs text-slate-500 font-medium">+{product.colors.length - 3}</span>
                                    )}
                                </div>
                            )}
                            
                            {/* Sizes */}
                            {sizes && sizes.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {sizes.slice(0, 2).map((size, index) => (
                                        <div key={index} className="text-xs px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                                            {size}
                                        </div>
                                    ))}
                                    {sizes.length > 2 && (
                                        <span className="text-xs text-slate-500 font-medium">+{sizes.length - 2}</span>
                                    )}
                                </div>
                            )}
                            
                            {/* Scents */}
                            {scents && scents.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {scents.slice(0, 1).map((scent, index) => (
                                        <div key={index} className="text-xs px-2 py-0.5 bg-purple-100 rounded-md text-purple-700 font-medium">
                                            {scent}
                                        </div>
                                    ))}
                                    {scents.length > 1 && (
                                        <span className="text-xs text-slate-500 font-medium">+{scents.length - 1}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Price and stock status */}
                    <div className='flex items-center justify-between mt-2 pt-3 border-t border-slate-100'>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <p className="font-bold text-lg text-slate-800">
                                    {currency}{product?.price || '0'}
                                </p>
                                {product?.mrp && product.mrp > product.price && (
                                    <span className="text-xs text-slate-400 line-through font-medium">
                                        {currency}{product.mrp}
                                    </span>
                                )}
                            </div>
                            {/* Show quantity if available */}
                            {totalQuantity !== null && totalQuantity > 0 && totalQuantity <= 10 && (
                                <span className="text-xs text-orange-600 font-medium mt-0.5">
                                    Only {totalQuantity} left
                                </span>
                            )}
                        </div>
                        
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            product?.inStock
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {product?.inStock ? 'In Stock' : 'Out'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard