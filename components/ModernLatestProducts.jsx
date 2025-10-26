'use client'
import React from 'react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowRight, ZapIcon } from 'lucide-react'

const ModernLatestProducts = () => {
    const displayQuantity = 5
    const products = useSelector(state => state.product.list)

    // Get the latest products
    const latestProducts = products.length > 0 ? 
        products
            .filter(product => product?.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, displayQuantity) : []

    return (
        <div className='py-16 bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <ZapIcon size={16} />
                            New Arrivals
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Just In</h2>
                        <p className="text-slate-600 max-w-2xl">Check out the latest products added to our collection</p>
                    </div>
                    <Link 
                        href='/shop?sort=newest' 
                        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium group whitespace-nowrap"
                    >
                        View newest products
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                {latestProducts.length > 0 ? (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                        {latestProducts.map((product, index) => (
                            <ProductCard key={product.id || product._id || index} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-500">No products available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModernLatestProducts