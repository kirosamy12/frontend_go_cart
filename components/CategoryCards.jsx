'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/lib/features/category/categorySlice'
import Image from 'next/image'
import Link from 'next/link'

const CategoryCards = () => {
    const dispatch = useDispatch()
    const { list: categories, loading } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    if (loading) return <p>Loading categories...</p>

    return (
        <div className="px-6 my-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Popular Categories</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Discover the most popular categories in our store</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.slice(0, 8).map((category, index) => (
                    <Link 
                        key={category.id} 
                        href={`/shop?category=${encodeURIComponent(category.slug)}`}
                        className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 h-64"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mt-16 -mr-16 opacity-50 group-hover:opacity-30 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -mb-12 -ml-12 opacity-50 group-hover:opacity-30 transition-opacity"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-indigo-50/40 z-10"></div>
                        
                        <div className="relative z-20 h-full flex flex-col p-6">
                            <div className="flex-1 flex items-center justify-center">
                                {category.image && category.image.trim() !== '' ? (
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shadow-lg">
                                        <span className="text-indigo-700 text-3xl font-bold">
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {category.name}
                                </h3>
                                <div className="mt-2 inline-flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                                    <span>Shop now</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15"></div>
                    </Link>
                ))}
            </div>
            
            <div className="text-center mt-10">
                <Link 
                    href="/all-products" 
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                    View All Categories
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}

export default CategoryCards