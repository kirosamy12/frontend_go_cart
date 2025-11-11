'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/lib/features/category/categorySlice'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CategoryCarousel = () => {
    const dispatch = useDispatch()
    const { list: categories, loading } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    if (loading) return <p className="text-center py-12">Loading categories...</p>

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Shop by Category</h2>
                        <p className="text-slate-600 max-w-2xl">Browse our wide range of product categories</p>
                    </div>
                    <Link 
                        href="/all-products" 
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium group whitespace-nowrap"
                    >
                        View all categories
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative">
                    <div className="overflow-x-auto pb-4 hide-scrollbar">
                        <div className="flex space-x-5 w-max">
                            {categories.map((category) => (
                                <Link 
                                    key={category.id} 
                                    href={`/shop?category=${encodeURIComponent(category.slug)}`}
                                    className="flex flex-col items-center justify-center min-w-[140px] p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="relative mb-4">
                                        {category.image && category.image.trim() !== '' ? (
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
                                                <span className="text-indigo-700 text-xl font-bold">
                                                    {category.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800 text-center group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    {/* Removed product count */}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    )
}

export default CategoryCarousel