'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/lib/features/category/categorySlice'
import Image from 'next/image'
import Link from 'next/link'

const CategoryMasonry = () => {
    const dispatch = useDispatch()
    const { list: categories, loading } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    if (loading) return <p>Loading categories...</p>

    // Split categories into two groups for masonry layout
    const firstColumn = categories.filter((_, index) => index % 2 === 0)
    const secondColumn = categories.filter((_, index) => index % 2 === 1)

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Browse Categories</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Discover our carefully curated collection of product categories</p>
            </div>

            <div className="flex gap-6 max-w-4xl mx-auto">
                <div className="flex-1 space-y-6">
                    {firstColumn.map((category) => (
                        <Link 
                            key={category.id} 
                            href={`/shop?category=${encodeURIComponent(category.slug)}`}
                            className="block group"
                        >
                            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 h-48 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-indigo-50/80 z-10"></div>
                                {category.image && category.image.trim() !== '' ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                        <span className="text-indigo-700 text-4xl font-bold">
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm mt-1">Explore products</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="flex-1 space-y-6 mt-12">
                    {secondColumn.map((category) => (
                        <Link 
                            key={category.id} 
                            href={`/shop?category=${encodeURIComponent(category.slug)}`}
                            className="block group"
                        >
                            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 h-48 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-indigo-50/80 z-10"></div>
                                {category.image && category.image.trim() !== '' ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                        <span className="text-indigo-700 text-4xl font-bold">
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm mt-1">Explore products</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryMasonry