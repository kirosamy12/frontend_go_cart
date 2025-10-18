'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import PageTitle from '@/components/PageTitle'

export default function Profile() {
    const { isAuthenticated, user, token } = useSelector(state => state.auth)
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('profile')
    const [addresses, setAddresses] = useState([])
    const [orders, setOrders] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin')
            return
        }
        fetchUserData()
    }, [isAuthenticated, router, token])

    const fetchUserData = async () => {
        if (!token) return
        setLoading(true)
        try {
            const [addressesRes, ordersRes, wishlistRes] = await Promise.all([
                fetch('https://go-cart-1bwm.vercel.app/api/user/addresses', {
                    headers: { 'token': token }
                }),
                fetch('https://go-cart-1bwm.vercel.app/api/user/orders', {
                    headers: { 'token': token }
                }),
                fetch('https://go-cart-1bwm.vercel.app/api/user/wishlist', {
                    headers: { 'token': token }
                })
            ])

            if (addressesRes.ok) {
                const addressesData = await addressesRes.json()
                setAddresses(addressesData.addresses || [])
            }
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json()
                setOrders(ordersData.orders || [])
            }
            if (wishlistRes.ok) {
                const wishlistData = await wishlistRes.json()
                setWishlist(wishlistData.wishlist || [])
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'profile', label: 'Profile' },
        { id: 'addresses', label: 'Addresses' },
        { id: 'orders', label: 'Orders' },
        { id: 'wishlist', label: 'Wishlist' }
    ]

    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto py-8">
                <PageTitle heading="My Account" text="Manage your account information" />

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-medium ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-slate-800 text-slate-800'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h2>

                            {user?.role === 'admin' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Admin Dashboard</h3>
                                        <p className="text-purple-600 mb-4">Manage stores, approve requests, and oversee the platform.</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-purple-600">Total Stores:</span>
                                                <span className="font-semibold text-purple-800">12</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-purple-600">Pending Approvals:</span>
                                                <span className="font-semibold text-purple-800">3</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-purple-600">Total Users:</span>
                                                <span className="font-semibold text-purple-800">156</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
                                                View All Stores
                                            </button>
                                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                                                Review Pending Requests
                                            </button>
                                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                                                Platform Analytics
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Recent Activity</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-green-600">New store registered</span>
                                                <span className="text-green-800">2h ago</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Store approved</span>
                                                <span className="text-green-800">5h ago</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">User reported issue</span>
                                                <span className="text-green-800">1d ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user?.role === 'store' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Store Dashboard</h3>
                                        <p className="text-green-600 mb-4">Manage your products, categories, and orders.</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Total Products:</span>
                                                <span className="font-semibold text-green-800">24</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Categories:</span>
                                                <span className="font-semibold text-green-800">8</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Total Orders:</span>
                                                <span className="font-semibold text-green-800">89</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                                                Add New Product
                                            </button>
                                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                                                Manage Categories
                                            </button>
                                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition">
                                                View Orders
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-orange-800 mb-2">Recent Activity</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-orange-600">New order received</span>
                                                <span className="text-orange-800">1h ago</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-600">Product added</span>
                                                <span className="text-orange-800">3h ago</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-600">Category updated</span>
                                                <span className="text-orange-800">1d ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user?.role === 'user' && (
                                <div className="text-center py-12">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to your Dashboard</h3>
                                        <p className="text-gray-600 mb-6">You don't have a specific dashboard as a regular user, but you can access all your account features through the tabs above.</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                                <div className="font-semibold text-blue-800">Orders</div>
                                                <div className="text-blue-600">Track your purchases</div>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded p-4">
                                                <div className="font-semibold text-green-800">Wishlist</div>
                                                <div className="text-green-600">Save favorites</div>
                                            </div>
                                            <div className="bg-purple-50 border border-purple-200 rounded p-4">
                                                <div className="font-semibold text-purple-800">Addresses</div>
                                                <div className="text-purple-600">Manage delivery</div>
                                            </div>
                                            <div className="bg-orange-50 border border-orange-200 rounded p-4">
                                                <div className="font-semibold text-orange-800">Profile</div>
                                                <div className="text-orange-600">Update info</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <ProfileForm user={user} token={token} />
                    )}

                    {activeTab === 'addresses' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">My Addresses</h2>
                            {loading ? (
                                <p>Loading addresses...</p>
                            ) : addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((address, index) => (
                                        <div key={index} className="border border-slate-200 rounded p-4">
                                            <p><strong>Name:</strong> {address.name}</p>
                                            <p><strong>Street:</strong> {address.street}</p>
                                            <p><strong>City:</strong> {address.city}, {address.state} {address.zip}</p>
                                            <p><strong>Country:</strong> {address.country}</p>
                                            <p><strong>Phone:</strong> {address.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No addresses found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">My Orders</h2>
                            {loading ? (
                                <p>Loading orders...</p>
                            ) : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-slate-200 rounded p-4">
                                            <p><strong>Order ID:</strong> {order.id}</p>
                                            <p><strong>Total:</strong> ${order.total}</p>
                                            <p><strong>Status:</strong> {order.status}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No orders found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">My Wishlist</h2>
                            {loading ? (
                                <p>Loading wishlist...</p>
                            ) : wishlist.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {wishlist.map((product) => (
                                        <div key={product.id} className="border border-slate-200 rounded p-4">
                                            <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover mb-2" />
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p className="text-slate-600">${product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No items in wishlist.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
