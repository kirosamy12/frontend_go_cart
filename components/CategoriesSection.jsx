'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/lib/features/category/categorySlice'
import Title from './Title'
import Image from 'next/image'
import Link from 'next/link'

const CategoriesSection = () => {
    const dispatch = useDispatch()
    const { list: categories, loading } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    if (loading) return <p className="text-center py-12">Loading categories...</p>

    // Generate random product counts for demo purposes
    const categoriesWithCounts = categories.map(category => ({
        ...category,
        productCount: Math.floor(Math.random() * 50) + 10
    }))

    return (
        <div className='py-16 bg-gradient-to-b from-white to-slate-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <Title 
                    title='Popular Categories' 
                    description="Explore our most popular product categories" 
                    href='/all-products' 
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 my-12">
                    {categoriesWithCounts.map((category) => (
                        <Link 
                            key={category.id} 
                            href={`/shop?category=${encodeURIComponent(category.slug)}`} 
                            className='flex flex-col items-center justify-center text-center p-6 border rounded-2xl group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 hover:from-indigo-50 hover:to-purple-50 hover:-translate-y-1 border-slate-200 relative overflow-hidden'
                        >
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                                {category.productCount}+
                            </div>
                            
                            <div className='relative mb-4'>
                                {category.image && category.image.trim() !== '' ? (
                                    <div className='relative w-16 h-16 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300'>
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className='object-cover group-hover:scale-110 transition-transform duration-300'
                                        />
                                    </div>
                                ) : (
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300'>
                                        <span className='text-indigo-700 text-xl font-bold'>
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className='absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                            </div>
                            
                            <h3 className='text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors'>{category.name}</h3>
                            
                            <div className='mt-2 text-xs text-slate-500'>
                                {category.productCount} products
                            </div>
                            
                            <div className='mt-3 w-8 h-0.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoriesSection