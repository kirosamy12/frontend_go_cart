'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import PageTitle from '@/components/PageTitle'
import MyReviews from '@/components/MyReviews'

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
        { id: 'profile', label: 'Profile' },
        { id: 'wishlist', label: 'Wishlist' },
        { id: 'reviews', label: 'My Reviews' }
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
                    {activeTab === 'profile' && (
                        <ProfileForm user={user} token={token} />
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

                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">My Reviews</h2>
                            <MyReviews />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
