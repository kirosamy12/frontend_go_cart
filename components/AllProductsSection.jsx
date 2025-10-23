'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const AllProductsSection = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='All Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products from all stores`} href='/all-products' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 justify-start'>
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
    )
}

export default AllProductsSection
