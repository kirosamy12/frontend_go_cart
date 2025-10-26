'use client'

import { addToCartAsync } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon, HeartIcon, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Counter from "./Counter";

const ModernProductDetails = ({ product }) => {

    const productId = product?.id || product?._id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cartItems = useSelector(state => state.cart.cartItems || {});
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems || []);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState('/placeholder-image.jpg');
    const [selectedColor, setSelectedColor] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Set main image when product changes
    useEffect(() => {
        if (product?.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    // Set default selected color when product changes
    useEffect(() => {
        if (product?.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        } else {
            setSelectedColor('');
        }
    }, [product]);

    // Check if product is in wishlist
    useEffect(() => {
        setIsWishlisted(wishlistItems.includes(productId));
    }, [wishlistItems, productId]);

    const addToCartHandler = () => {
        if (productId) {
            dispatch(addToCartAsync({
                productId,
                quantity: 1,
                selectedColor: selectedColor || null
            }))
        }
    }

    const toggleWishlist = () => {
        // This would typically dispatch an action to add/remove from wishlist
        // For now, we'll just toggle the state
        setIsWishlisted(!isWishlisted);
    }

    const averageRating = product?.rating && product.rating.length > 0 ? 
        (product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length).toFixed(1) : 0;
    
    const totalReviews = product?.rating ? product.rating.length : 0;

    // Calculate discount percentage
    const discountPercentage = product?.mrp && product?.price ? 
        Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="flex flex-col lg:w-1/2">
                        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-sm">
                            <Image 
                                src={mainImage || '/placeholder-image.jpg'} 
                                alt={product?.name || 'Product'} 
                                fill
                                className="object-contain p-8 hover:scale-105 transition-transform duration-300" 
                            />
                            {discountPercentage > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    {discountPercentage}% OFF
                                </div>
                            )}
                            <button 
                                onClick={toggleWishlist}
                                className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                                    isWishlisted 
                                        ? 'text-red-500 bg-red-50' 
                                        : 'text-slate-400 bg-white hover:text-red-500'
                                }`}
                            >
                                <HeartIcon size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        
                        {product?.images && product.images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 hide-scrollbar">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(product.images[index])}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            mainImage === image 
                                                ? 'border-indigo-500 ring-2 ring-indigo-200' 
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <Image 
                                            src={image || '/placeholder-image.jpg'} 
                                            alt="" 
                                            fill
                                            className="object-cover" 
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="lg:w-1/2">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">{product?.name || 'Product Name'}</h1>
                                <div className="flex items-center mt-2">
                                    <div className='flex items-center'>
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon 
                                                key={index} 
                                                size={16} 
                                                className='text-transparent' 
                                                fill={averageRating >= index + 1 ? "#fbbf24" : "#D1D5DB"} 
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-slate-600">
                                        {averageRating} ({totalReviews} reviews)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-slate-800">
                                    {currency}{product?.price || '0'}
                                </p>
                                {product?.mrp && product.mrp > product.price && (
                                    <p className="text-xl text-slate-500 line-through">
                                        {currency}{product?.mrp || '0'}
                                    </p>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded">
                                        Save {discountPercentage}%
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-slate-600">
                                {product?.description || 'Product description not available.'}
                            </p>
                            
                            {/* Color Selection */}
                            {product?.colors && product.colors.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-3">Select Color</p>
                                    <div className="flex gap-3 flex-wrap">
                                        {product.colors.map((color, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                                                    selectedColor === color
                                                        ? 'border-indigo-500 ring-2 ring-indigo-200'
                                                        : 'border-slate-300 hover:border-slate-500'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            >
                                                {selectedColor === color && (
                                                    <div className="w-4 h-4 rounded-full bg-white"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedColor && (
                                        <p className="text-sm text-slate-500 mt-2">
                                            Selected: <span className="font-medium">{selectedColor}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {cartItems[productId] ? (
                                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                                        <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                        <Counter productId={productId} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={addToCartHandler}
                                        disabled={product?.colors && product.colors.length > 0 && !selectedColor}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => cartItems[productId] ? router.push('/cart') : addToCartHandler()}
                                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {cartItems[productId] ? 'View Cart' : 'Buy Now'}
                                </button>
                            </div>
                            
                            {/* Product Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <TruckIcon size={20} className="text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Free Shipping</p>
                                        <p className="text-sm font-medium">On orders over $50</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <RotateCcwIcon size={20} className="text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Easy Returns</p>
                                        <p className="text-sm font-medium">30-day guarantee</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <ShieldCheckIcon size={20} className="text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Secure Payment</p>
                                        <p className="text-sm font-medium">100% protected</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Category & Tags */}
                            <div className="flex flex-wrap gap-2 pt-4">
                                <span className="text-sm text-slate-500">Category:</span>
                                <span className="text-sm font-medium text-indigo-600">
                                    {product?.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModernProductDetails