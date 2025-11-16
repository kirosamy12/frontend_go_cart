'use client'

import { addToCartAsync } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {

    const productId = product?.id || product?._id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP';

    const cartItems = useSelector(state => state.cart.cartItems || {});
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState('/placeholder-image.jpg');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState(''); // Add state for selected size

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
        
        // Set default selected size when product changes
        if (product?.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize('');
        }
    }, [product]);

    const addToCartHandler = () => {
        if (productId) {
            dispatch(addToCartAsync({
                productId,
                quantity: 1,
                selectedColor: selectedColor || null,
                selectedSize: selectedSize || null // Include selected size
            }))
        }
    }

    const averageRating = product?.rating && product.rating.length > 0 ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length : 0;

    // Calculate discount percentage
    const discountPercentage = product?.mrp && product?.price ? 
        Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    // Get available quantity for selected color and size
    const getAvailableQuantity = () => {
        if (!selectedColor && !selectedSize) {
            // If no color/size selected, show total quantity for the size
            if (product?.sizeQuantities && selectedSize) {
                return product.sizeQuantities[selectedSize] || 0;
            }
            return null;
        }
        
        if (selectedColor && selectedSize) {
            // Show quantity for specific color/size combination
            if (product?.colorSizeQuantities?.[selectedColor]?.[selectedSize] !== undefined) {
                return product.colorSizeQuantities[selectedColor][selectedSize];
            }
        } else if (selectedSize) {
            // Show quantity for size only
            if (product?.sizeQuantities?.[selectedSize] !== undefined) {
                return product.sizeQuantities[selectedSize];
            }
        }
        return null;
    };

    const availableQuantity = getAvailableQuantity();

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
            
            <div className="lg:w-1/2">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{product?.name || 'Product Name'}</h1>
                        <div className='flex items-center mt-2'>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    size={16} 
                                    className='text-transparent' 
                                    fill={averageRating >= index + 1 ? "#fbbf24" : "#D1D5DB"} 
                                />
                            ))}
                            <p className="text-sm ml-2 text-slate-600">
                                {product?.rating && product.rating.length > 0 ? product.rating.length : 0} Reviews
                            </p>
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
                    
                    {/* Size Selection */}
                    {product?.sizes && product.sizes.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">Select Size</p>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map((size, index) => {
                                    // Check if this size is available for the selected color
                                    let isAvailable = true;
                                    if (selectedColor && product?.colorSizeQuantities?.[selectedColor]) {
                                        isAvailable = (product.colorSizeQuantities[selectedColor][size] || 0) > 0;
                                    } else if (product?.sizeQuantities) {
                                        isAvailable = (product.sizeQuantities[size] || 0) > 0;
                                    }
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={!isAvailable}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                                                selectedSize === size
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : isAvailable
                                                        ? 'border-slate-300 hover:border-slate-500 text-slate-700'
                                                        : 'border-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedSize && (
                                <p className="text-sm text-slate-500 mt-2">
                                    Selected: <span className="font-medium">{selectedSize}</span>
                                </p>
                            )}
                            
                            {/* Display available quantity */}
                            {availableQuantity !== null && (
                                <p className="text-sm text-slate-500 mt-2">
                                    Available: <span className="font-medium">{availableQuantity} items</span>
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {cartItems[productId] ? (
                            <div className="flex flex-col gap-3 w-full sm:w-auto">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        ) : (
                            <button
                                onClick={addToCartHandler}
                                disabled={(product?.colors && product.colors.length > 0 && !selectedColor) || 
                                         (product?.sizes && product.sizes.length > 0 && !selectedSize)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                        )}
                        
                        <button
                            onClick={() => cartItems[productId] ? router.push('/cart') : addToCartHandler()}
                            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 font-medium rounded-lg hover:shadow-md transition-all"
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
                </div>
            </div>
        </div>
    )
}

export default ProductDetails