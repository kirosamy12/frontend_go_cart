'use client'
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCartAsync, updateCart } from "@/lib/features/cart/cartSlice"
import { fetchProducts } from "@/lib/features/product/productSlice"
import { 
  ShoppingBagIcon, 
  Trash2Icon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingCartIcon,
  ArrowLeftIcon,
  PackageIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const ModernCart = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
  const router = useRouter()
  const dispatch = useDispatch()

  const { cartItems } = useSelector(state => state.cart)
  const products = useSelector(state => state.product.list)
  const { token } = useSelector(state => state.auth)

  const [cartArray, setCartArray] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  // Create cart array from cart items and products
  const createCartArray = () => {
    setTotalPrice(0)
    const cartArray = []
    if (cartItems && typeof cartItems === 'object') {
      for (const [key, value] of Object.entries(cartItems)) {
        const product = products.find(product => (product.id || product._id) === key)
        if (product) {
          // Check if cartItems[key] is an object with quantity and selectedColor
          const itemData = typeof value === 'object' ? value : { quantity: value, selectedColor: null }
          const itemTotal = product.price * itemData.quantity
          cartArray.push({
            ...product,
            quantity: itemData.quantity,
            selectedColor: itemData.selectedColor,
            itemTotal
          })
          setTotalPrice(prev => prev + itemTotal)
        }
      }
    }
    setCartArray(cartArray)
  }

  // Fetch products if not loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [products.length, dispatch])

  // Update cart array when cart items or products change
  useEffect(() => {
    if (products.length > 0) {
      createCartArray()
    }
  }, [cartItems, products])

  // Update item quantity
  const updateItemQuantity = async (productId, newQuantity) => {
    if (isUpdating || newQuantity < 1) return
    setIsUpdating(true)
    
    try {
      if (newQuantity === 0) {
        await dispatch(removeFromCartAsync(productId)).unwrap()
      } else {
        await dispatch(updateCart({ productId, quantity: newQuantity })).unwrap()
      }
    } catch (error) {
      console.error('Failed to update cart item:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Remove item from cart
  const removeItem = async (productId) => {
    if (isUpdating) return
    setIsUpdating(true)
    
    try {
      await dispatch(removeFromCartAsync(productId)).unwrap()
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Continue shopping
  const continueShopping = () => {
    router.push('/shop')
  }

  // Proceed to checkout
  const proceedToCheckout = () => {
    router.push('/checkout')
  }

  if (cartArray.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCartIcon size={48} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Your cart is empty</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ShoppingBagIcon size={20} />
                Start Shopping
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
              >
                <ArrowLeftIcon size={20} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <ShoppingCartIcon size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Shopping Cart</h1>
            <p className="text-slate-600">{cartArray.length} item{cartArray.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-slate-100">
                {cartArray.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                          <Image 
                            src={item.images[0]} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800">{item.name}</h3>
                            <p className="text-sm text-slate-500">{item.category?.name}</p>
                            {item.selectedColor && (
                              <p className="text-xs text-indigo-600 mt-1">Color: {item.selectedColor}</p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-indigo-600 mt-1">Size: {item.selectedSize}</p>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2Icon size={18} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-slate-200 rounded-lg">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <MinusIcon size={16} />
                              </button>
                              <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                disabled={isUpdating}
                                className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PlusIcon size={16} />
                              </button>
                            </div>
                            
                            <span className="text-sm text-slate-500">
                              {currency}{item.price.toFixed(2)} each
                            </span>
                          </div>
                          
                          <div className="font-semibold text-slate-800">
                            {currency}{item.itemTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={continueShopping}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeftIcon size={18} />
                    Continue Shopping
                  </button>
                  
                  <button
                    onClick={() => cartArray.forEach(item => removeItem(item.id))}
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2Icon size={18} />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-8">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{currency}{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-medium">{currency}0.00</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-slate-800">Total</span>
                      <span className="text-lg font-bold text-indigo-600">{currency}{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <PackageIcon size={20} />
                    Proceed to Checkout
                  </button>
                  
                  <div className="text-center text-sm text-slate-500">
                    or{" "}
                    <button 
                      onClick={continueShopping}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Secure Checkout */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <PackageIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Secure Checkout</h3>
                  <p className="text-sm text-slate-600">SSL encryption protects your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernCart