'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, BarChart3Icon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const [activeView, setActiveView] = useState('overview') // 'overview' or 'analytics'

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

const fetchDashboardData = async () => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token')

        const res = await fetch('https://go-cart-1bwm.vercel.app/api/admin/dashboard', {
            headers: {
                'token': token ? `${token}` : '',
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            const data = await res.json()
            setDashboardData({
                products: data.products || 0,
                revenue: data.revenue || 0,
                orders: data.orders || 0,
                stores: data.stores || 0,
                allOrders: data.allOrders || [],
            })
        } else {
            setDashboardData({
                products: 0,
                revenue: 0,
                orders: 0,
                stores: 0,
                allOrders: [],
            })
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData({
            products: 0,
            revenue: 0,
            orders: 0,
            stores: 0,
            allOrders: [],
        })
    }
    setLoading(false)
}

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>
                
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveView('overview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === 'overview' 
                                ? 'bg-white text-slate-800 shadow-sm' 
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        <BarChart3Icon size={16} />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveView('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === 'analytics' 
                                ? 'bg-white text-slate-800 shadow-sm' 
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        <BarChart3Icon size={16} />
                        Advanced Analytics
                    </button>
                </div>
            </div>

            {activeView === 'overview' ? (
                <>
                    {/* Cards */}
                    <div className="flex flex-wrap gap-5 my-10 mt-4">
                        {
                            dashboardCardsData.map((card, index) => (
                                <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                                    <div className="flex flex-col gap-3 text-xs">
                                        <p>{card.title}</p>
                                        <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                                    </div>
                                    <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                                </div>
                            ))
                        }
                    </div>

                    {/* Area Chart */}
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </>
            ) : (
                <div className="mt-6">
                    <AdvancedAnalyticsDashboard />
                </div>
            )}
        </div>
    )
}