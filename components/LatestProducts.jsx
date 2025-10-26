'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { ZapIcon } from 'lucide-react'

const LatestProducts = () => {

    const displayQuantity = 5
    const products = useSelector(state => state.product.list)

    return (
        <div className='py-16 bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                    <ZapIcon size={16} />
                    New Arrivals
                </div>
                <Title 
                    title='Just In' 
                    description={`Check out the latest products added to our collection`} 
                    href='/shop?sort=newest' 
                />
                <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                    {products.length > 0 ? (
                        products
                            .filter(product => product?.createdAt) // Only include products with createdAt
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, displayQuantity)
                            .map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500">No products available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LatestProducts