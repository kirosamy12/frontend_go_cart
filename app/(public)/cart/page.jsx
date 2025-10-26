'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart, updateCart, createCart, getCart, removeFromCartAsync } from "@/lib/features/cart/cartSlice";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const { token } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        if (cartItems && typeof cartItems === 'object') {
            for (const [key, value] of Object.entries(cartItems)) {
                const product = products.find(product => (product.id || product._id) === key);
                if (product) {
                    // Check if cartItems[key] is an object with quantity and selectedColor
                    const itemData = typeof value === 'object' ? value : { quantity: value, selectedColor: null };
                    cartArray.push({
                        ...product,
                        quantity: itemData.quantity,
                        selectedColor: itemData.selectedColor,
                    });
                    setTotalPrice(prev => prev + product.price * itemData.quantity);
                }
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = async (productId) => {
        try {
            await dispatch(removeFromCartAsync(productId)).unwrap();
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    }

    // Fetch products if not loaded
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [products.length, dispatch]);

    // Load cart from backend when user is authenticated
    useEffect(() => {
        if (token) {
            dispatch(getCart());
        }
    }, [token, dispatch]);

    // Create cart on backend when user is authenticated and cart is empty
    useEffect(() => {
        if (token && cartItems && Object.keys(cartItems).length === 0) {
            dispatch(createCart());
        }
    }, [token, cartItems, dispatch]);

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);



    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className="space-x-2">
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.category?.name}</p>
                                                {item.selectedColor && (
                                                    <p className="text-xs text-blue-600">Color: {item.selectedColor}</p>
                                                )}
                                                <p>{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}
