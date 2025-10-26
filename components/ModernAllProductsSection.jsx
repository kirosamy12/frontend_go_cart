'use client'
import React from 'react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ModernAllProductsSection = () => {
    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    // Get the latest products
    const latestProducts = products.length > 0 ? 
        products
            .filter(product => product?.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, displayQuantity) : []

    return (
        <div className='py-16 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Latest Products</h2>
                        <p className="text-slate-600 max-w-2xl">Discover our newest arrivals and trending products</p>
                    </div>
                    <Link 
                        href='/all-products' 
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium group whitespace-nowrap"
                    >
                        View all products
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

export default ModernAllProductsSection