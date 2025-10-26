'use client'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowRight, AwardIcon, StarIcon } from 'lucide-react'

const ModernBestSelling = () => {
    const displayQuantity = 5
    const products = useSelector(state => state.product.list)

    // Get best selling products (by rating count)
    const bestSellingProducts = products.length > 0 ? 
        products
            .filter(product => product?.rating && Array.isArray(product.rating))
            .sort((a, b) => b.rating.length - a.rating.length)
            .slice(0, displayQuantity) : []

    return (
        <div className='py-16 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <AwardIcon size={16} />
                            Customer Favorites
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Best Sellers</h2>
                        <p className="text-slate-600 max-w-2xl">Our most popular products loved by thousands of customers</p>
                    </div>
                    <Link 
                        href='/shop?sort=rating' 
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium group whitespace-nowrap"
                    >
                        View best sellers
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                {bestSellingProducts.length > 0 ? (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                        {bestSellingProducts.map((product, index) => (
                            <ProductCard key={product.id || product._id || index} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-500">No products available</p>
                    </div>
                )}
                
                {/* Rating display for best selling products */}
                {bestSellingProducts.length > 0 && (
                    <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <StarIcon className="text-amber-500" fill="currentColor" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Top-Rated Products</h3>
                                    <p className="text-slate-600 text-sm">Based on customer reviews and ratings</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon 
                                        key={star} 
                                        className="text-amber-400" 
                                        fill="currentColor" 
                                        size={20} 
                                    />
                                ))}
                                <span className="ml-2 font-bold text-slate-800">
                                    {bestSellingProducts[0]?.rating && bestSellingProducts[0].rating.length > 0
                                        ? (bestSellingProducts[0].rating.reduce((acc, curr) => acc + curr.rating, 0) / bestSellingProducts[0].rating.length).toFixed(1)
                                        : '0.0'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModernBestSelling