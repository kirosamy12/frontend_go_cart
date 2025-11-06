'use client'
import React, { useEffect } from "react";
import PageTitle from "@/components/PageTitle"
import OrderItem from "@/components/OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "@/lib/features/orders/ordersSlice";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Orders() {

    const dispatch = useDispatch();
    const { list: orders, loading } = useSelector(state => state.orders);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(getUserOrders());
        }
    }, [token, dispatch]);

    if (loading) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <div className="text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Loading orders...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="my-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
                        <p className="text-slate-600 mt-2">
                            {orders.length > 0 
                                ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}` 
                                : 'You haven\'t placed any orders yet'}
                        </p>
                    </div>
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        <HomeIcon size={18} />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {orders.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-slate-500">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="max-sm:text-sm text-slate-600">
                                        <th className="text-left py-4 px-6 font-semibold">Product</th>
                                        <th className="text-center py-4 px-6 font-semibold max-md:hidden">Total Price</th>
                                        <th className="text-left py-4 px-6 font-semibold max-md:hidden">Address</th>
                                        <th className="text-left py-4 px-6 font-semibold max-md:hidden">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Render each order with a unique key */}
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id || order._id}>
                                            <OrderItem order={order} />
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No orders yet</h3>
                            <p className="text-slate-600 mb-6">You haven't placed any orders. Start shopping now!</p>
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}