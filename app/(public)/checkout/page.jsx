'use client'
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { fetchProducts } from "@/lib/features/product/productSlice"
import ModernOrderSummary from "@/components/ModernOrderSummary"
import { ArrowLeftIcon, ShoppingCartIcon, PackageIcon } from "lucide-react"
import Image from "next/image"

export default function Checkout() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
  
  const { cartItems } = useSelector(state => state.cart)
  const products = useSelector(state => state.product.list)

  // Fetch products if not loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [products.length, dispatch])

  // Create cart array from cart items and products
  const cartArray = []
  let totalPrice = 0
  
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
        totalPrice += itemTotal
      }
    }
  }

  // Redirect to cart if empty
  useEffect(() => {
    if (cartArray.length === 0) {
      router.push('/cart')
    }
  }, [cartArray.length, router])

  if (cartArray.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <PackageIcon size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
            <p className="text-slate-600">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Order Items</h2>
              </div>
              
              <div className="divide-y divide-slate-100">
                {cartArray.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
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
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">
                              {item.quantity} × {currency}{item.price.toFixed(2)}
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
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => router.push('/cart')}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowLeftIcon size={18} />
                    Back to Cart
                  </button>
                  
                  <div className="text-right">
                    <p className="text-slate-600">Total</p>
                    <p className="text-xl font-bold text-indigo-600">{currency}{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <ModernOrderSummary totalPrice={totalPrice} items={cartArray} />
          </div>
        </div>
      </div>
    </div>
  )
}