'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Latest Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
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
    )
}

export default LatestProducts
