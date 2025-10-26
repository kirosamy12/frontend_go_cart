'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { AwardIcon } from 'lucide-react'

const BestSelling = () => {

    const displayQuantity = 5
    const products = useSelector(state => state.product.list)

    return (
        <div className='py-16 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                    <AwardIcon size={16} />
                    Customer Favorites
                </div>
                <Title 
                    title='Best Sellers' 
                    description={`Our most popular products loved by thousands of customers`} 
                    href='/shop?sort=rating' 
                />
                <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                    {products.length > 0 ? (
                        products
                            .filter(product => product?.rating && Array.isArray(product.rating)) // Only include products with rating array
                            .sort((a, b) => b.rating.length - a.rating.length)
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

export default BestSelling