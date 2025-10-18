'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon, TrendingUpIcon, PackageIcon, UsersIcon, PlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchStoreProducts } from "@/lib/features/product/productSlice"
import { getStoreOrders } from "@/lib/features/orders/ordersSlice"

export default function Dashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()
    const dispatch = useDispatch()

    const { token, isAuthenticated, user } = useSelector(state => state.auth)
    const { list: products, loading: productsLoading, error: productsError } = useSelector(state => state.product)
    const { storeOrders, loading: ordersLoading, error: ordersError } = useSelector(state => state.orders)

    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchStoreProducts())
            dispatch(getStoreOrders())
        }
    }, [dispatch, isAuthenticated, token])

    useEffect(() => {
        if (products.length > 0) {
            // Calculate dashboard data from real products
            const totalProducts = products.length
            const totalEarnings = products.reduce((sum, product) => sum + (product.price * (product.sold || 0)), 0)
            const totalOrders = products.reduce((sum, product) => sum + (product.sold || 0), 0)

            // Mock ratings data for now (you can replace this with real ratings API later)
            const mockRatings = products.slice(0, 3).map((product, index) => ({
                id: product.id,
                user: {
                    name: `User ${index + 1}`,
                    image: '/assets/profile_pic1.jpg' // You can make this dynamic
                },
                product: product,
                rating: Math.floor(Math.random() * 5) + 1,
                review: `Great product! ${product.description?.substring(0, 50)}...`,
                createdAt: new Date().toISOString()
            }))

            setDashboardData({
                totalProducts,
                totalEarnings,
                totalOrders,
                ratings: mockRatings,
            })
        }
    }, [products])

    if (productsLoading || ordersLoading) return <Loading />

    if (productsError || ordersError) {
        return (
            <div className="text-slate-500 dark:text-slate-400 mb-28 px-4">
                <h1 className="text-2xl">Seller <span className="text-slate-800 dark:text-slate-100 font-medium">Dashboard</span></h1>
                <p className="text-red-600 mt-4">Error loading dashboard: {productsError || ordersError}</p>
            </div>
        )
    }

    return (
        <div className="text-slate-500 dark:text-slate-400 mb-28 px-4 md:px-0">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 md:p-6 mb-8 border border-blue-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {user?.name || 'Store Owner'}!</h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm md:text-base">Here's what's happening with your store today.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/store/add-product" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base">
                            <PlusIcon size={18} />
                            Add Product
                        </Link>
                        <Link href="/store/orders" className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm md:text-base">
                            <PackageIcon size={18} />
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{card.title}</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 md:p-3 rounded-lg">
                                <card.icon size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUpIcon size={20} className="text-slate-600 dark:text-slate-400" />
                    <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Sales Analytics</h2>
                </div>
                {storeOrders.length > 0 ? (
                    <OrdersAreaChart allOrders={storeOrders} />
                ) : (
                    <div className="h-[250px] md:h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <div className="text-center">
                            <TrendingUpIcon size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                            <p>No orders data available yet</p>
                            <p className="text-sm">Start selling to see your analytics here</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <PackageIcon size={20} className="text-slate-600 dark:text-slate-400" />
                        <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Recent Orders</h2>
                    </div>
                    <Link href="/store/orders" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                        View All →
                    </Link>
                </div>
                {storeOrders.length > 0 ? (
                    <div className="space-y-4">
                        {storeOrders.slice(0, 5).map((order) => (
                            <div key={order.id || order._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                                        <PackageIcon size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-100">Order #{order.id || order._id}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{order.customer?.name || 'Customer'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-2">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{currency}{order.total}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-end ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                        {order.status || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <PackageIcon size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p>No orders yet</p>
                        <p className="text-sm">Your recent orders will appear here</p>
                    </div>
                )}
            </div>

            {/* Customer Reviews */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <StarIcon size={20} className="text-slate-600 dark:text-slate-400" />
                    <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Customer Reviews</h2>
                </div>
                {dashboardData.ratings.length > 0 ? (
                    <div className="space-y-6">
                        {dashboardData.ratings.map((review, index) => (
                            <div key={index} className="border border-slate-100 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Image src={review.user.image} alt="" className="w-12 h-12 rounded-full self-center sm:self-start" width={48} height={48} />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-100">{review.user.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-1 self-center sm:self-start">
                                                {Array(5).fill('').map((_, starIndex) => (
                                                    <StarIcon key={starIndex} size={16} className="text-yellow-400" fill={review.rating >= starIndex + 1 ? "#fbbf24" : "transparent"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 mb-3">{review.review}</p>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{review.product?.category?.name || 'General'}</p>
                                                <p className="font-medium text-slate-800 dark:text-slate-100">{review.product?.name}</p>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/product/${review.product.id}`)}
                                                className="bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors text-sm font-medium self-center sm:self-start"
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <StarIcon size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p>No reviews yet</p>
                        <p className="text-sm">Customer reviews will appear here once they start leaving feedback</p>
                    </div>
                )}
            </div>

            {/* Your Products */}
            {products.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ShoppingBasketIcon size={20} className="text-slate-600 dark:text-slate-400" />
                            <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Your Products</h2>
                        </div>
                        <Link href="/store/manage-product" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                            Manage All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {products.slice(0, 6).map((product) => (
                            <div key={product.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                                <div className="relative">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-40 md:h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            product.inStock
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4">
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 text-sm md:text-base">{product.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm mb-3 line-clamp-2">{product.description?.substring(0, 80)}...</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">{currency}{product.price}</span>
                                        <button
                                            onClick={() => router.push(`/product/${product.id}`)}
                                            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs md:text-sm"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
