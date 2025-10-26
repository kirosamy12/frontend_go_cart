'use client'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateCart, createCart, removeFromCartAsync } from "@/lib/features/cart/cartSlice"
import { PlusIcon, MinusIcon } from "lucide-react"

const ModernCounter = ({ productId, initialQuantity = 1 }) => {
  const { cartItems } = useSelector(state => state.cart)
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Get current quantity from cart
  const currentQuantity = cartItems[productId] 
    ? (typeof cartItems[productId] === 'object' 
        ? cartItems[productId].quantity 
        : cartItems[productId])
    : initialQuantity

  const updateQuantity = async (newQuantity) => {
    if (isUpdating || newQuantity < 0) return
    setIsUpdating(true)
    
    try {
      // If cart is empty and user is authenticated, create cart first
      if (token && Object.keys(cartItems).length === 0) {
        await dispatch(createCart()).unwrap()
      }
      
      if (newQuantity === 0) {
        // Remove item from cart
        await dispatch(removeFromCartAsync(productId)).unwrap()
      } else {
        // Update item quantity
        await dispatch(updateCart({ productId, quantity: newQuantity })).unwrap()
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => updateQuantity(currentQuantity - 1)}
        disabled={isUpdating || currentQuantity <= 1}
        className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <MinusIcon size={16} />
      </button>
      
      <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
        {currentQuantity}
      </span>
      
      <button
        onClick={() => updateQuantity(currentQuantity + 1)}
        disabled={isUpdating}
        className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  )
}

export default ModernCounter