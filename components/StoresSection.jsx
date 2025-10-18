'use client'
import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from 'react'

const StoresSection = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStores = async () => {
            try {
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
                        console.error('Unexpected response structure:', data)
                        setError('Unexpected response structure')
                    }
                    setStores(storesArray)
                } else {
                    console.error('Failed to fetch stores')
                    setError('Failed to fetch stores')
                }
            } catch (error) {
                console.error('Error fetching stores:', error)
                setError('Unable to connect to server. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchStores()
    }, [])

    if (loading) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Our Stores</h2>
                    <div className="text-center">Loading stores...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Our Stores</h2>
                    <div className="text-center text-red-600">{error}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Our Stores</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {stores.map((store) => (
                        <Link key={store.id} href={`/shop/${store.username}`} className="group">
                            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                                <Image
                                    src={store.logo}
                                    alt={store.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full object-cover mb-2 group-hover:scale-105 transition-transform"
                                />
                                <p className="text-sm font-medium text-slate-700 text-center">{store.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StoresSection
