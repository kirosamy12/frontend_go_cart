'use client'
import { addToCartAsync, updateCart, createCart, removeFromCartAsync } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);
    const { token } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);

    const addToCartHandler = async () => {
        if (isUpdating) return; // Prevent multiple clicks
        setIsUpdating(true);
        try {
            // If cart is empty and user is authenticated, create cart first
            if (token && Object.keys(cartItems).length === 0) {
                await dispatch(createCart()).unwrap();
            }
            const currentItem = cartItems[productId];
            const currentQuantity = typeof currentItem === 'object' ? currentItem.quantity : currentItem || 0;
            const newQuantity = currentQuantity + 1;
            await dispatch(updateCart({ productId, quantity: newQuantity })).unwrap();
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsUpdating(false);
        }
    }

    const removeFromCartHandler = async () => {
        if (isUpdating) return; // Prevent multiple clicks
        setIsUpdating(true);
        try {
            await dispatch(removeFromCartAsync(productId)).unwrap();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} disabled={isUpdating} className="p-1 select-none disabled:opacity-50">-</button>
            <p className="p-1">{typeof cartItems[productId] === 'object' ? cartItems[productId].quantity : cartItems[productId]}</p>
            <button onClick={addToCartHandler} disabled={isUpdating} className="p-1 select-none disabled:opacity-50">+</button>
        </div>
    )
}

export default Counter
