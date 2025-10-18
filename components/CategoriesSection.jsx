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

    if (loading) return <p>Loading categories...</p>

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Shop by Categories' description="Explore our wide range of product categories to find exactly what you're looking for." />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 my-10 max-w-7xl mx-auto select-none">
                {categories.map((category) => (
                    <Link key={category.id} href={`/shop?category=${encodeURIComponent(category.slug)}`} className='flex flex-col items-center justify-center text-center p-6 border rounded-xl group hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 hover:to-indigo-50'>

                        <div className='relative mb-3'>
                            {category.image && category.image.trim() !== '' ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={60}
                                    height={60}
                                    className='rounded-full group-hover:rotate-12 transition-transform duration-300 shadow-sm'
                                />
                            ) : (
                                <div className='w-15 h-15 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-sm'>
                                    <span className='text-slate-600 text-xl font-bold'>
                                        {category.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className='absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                        </div>
                        <h3 className='text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors'>{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoriesSection
