'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, StoreIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const ModernStoresSection = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStores = async () => {
            try {
                // Try to fetch stores from the API
                const res = await fetch('https://go-cart-1bwm.vercel.app/api/getAllStores')
                if (res.ok) {
                    const data = await res.json()
                    // Handle different response structures
                    let storesArray = []
                    if (Array.isArray(data)) {
                        storesArray = data
                    } else if (data.stores && Array.isArray(data.stores)) {
                        storesArray = data.stores
                    } else if (data.data && Array.isArray(data.data)) {
                        storesArray = data.data
                    } else {
                        console.warn('Unexpected response structure:', data)
                        // Use dummy data as fallback
                        storesArray = getDummyStores()
                    }
                    setStores(storesArray)
                } else {
                    console.warn('Failed to fetch stores, using dummy data')
                    // Use dummy data as fallback
                    setStores(getDummyStores())
                }
            } catch (error) {
                console.warn('Error fetching stores, using dummy data:', error)
                // Use dummy data as fallback
                setStores(getDummyStores())
            } finally {
                setLoading(false)
            }
        }
        fetchStores()
    }, [])

    // Dummy data as fallback
    const getDummyStores = () => {
        return [
            {
                id: 1,
                name: 'Tech Haven',
                username: 'tech-haven',
                logo: '/gs_logo.jpg',
                productsCount: 42
            },
            {
                id: 2,
                name: 'Fashion Hub',
                username: 'fashion-hub',
                logo: '/gs_logo.jpg',
                productsCount: 28
            },
            {
                id: 3,
                name: 'Home Essentials',
                username: 'home-essentials',
                logo: '/gs_logo.jpg',
                productsCount: 35
            },
            {
                id: 4,
                name: 'Beauty World',
                username: 'beauty-world',
                logo: '/gs_logo.jpg',
                productsCount: 19
            },
            {
                id: 5,
                name: 'Sports Zone',
                username: 'sports-zone',
                logo: '/gs_logo.jpg',
                productsCount: 56
            },
            {
                id: 6,
                name: 'Book Nook',
                username: 'book-nook',
                logo: '/gs_logo.jpg',
                productsCount: 73
            }
        ]
    }

    if (loading) {
        return (
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Featured Stores</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Discover our amazing collection of stores offering the best products</p>
                    </div>
                    <div className="text-center">Loading stores...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-16 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <StoreIcon size={16} />
                        Our Stores
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Featured Stores</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Discover our amazing collection of stores offering the best products</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {stores.slice(0, 6).map((store) => (
                        <Link 
                            key={store.id} 
                            href={`/shop/${store.username}`} 
                            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-indigo-200 flex flex-col items-center"
                        >
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
                                <Image
                                    src={store.logo}
                                    alt={store.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-800 text-center group-hover:text-indigo-600 transition-colors">
                                {store.name}
                            </h3>
                            <div className="mt-2 text-xs text-slate-500 text-center">
                                {store.productsCount || 0} products
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="text-center mt-10">
                    <Link 
                        href="/all-products" 
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium group"
                    >
                        View all stores
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ModernStoresSection