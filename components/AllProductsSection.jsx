'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const AllProductsSection = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='py-16 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <Title 
                    title='All Products' 
                    description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products from all stores`} 
                    href='/all-products' 
                />
                <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                    {products.length > 0 ? (
                        products
                            .filter(product => product?.createdAt) // Only include products with createdAt
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                            .slice(0, displayQuantity)
                            .map((product, index) => (
                                <ProductCard key={product.id || product._id || index} product={product} />
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

export default AllProductsSection