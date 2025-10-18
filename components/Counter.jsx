'use client'
import { addToCartAsync, updateCart, createCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Counter = ({ productId }) => {

    const { cartItems, loading } = useSelector(state => state.cart);
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
            const newQuantity = (cartItems[productId] || 0) + 1;
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
            const currentQuantity = cartItems[productId] || 0;
            const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 0;
            await dispatch(updateCart({ productId, quantity: newQuantity })).unwrap();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} disabled={isUpdating} className="p-1 select-none disabled:opacity-50">-</button>
            <p className="p-1">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} disabled={isUpdating} className="p-1 select-none disabled:opacity-50">+</button>
        </div>
    )
}

export default Counter
