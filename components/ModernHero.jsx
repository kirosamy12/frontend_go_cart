'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, ShoppingCartIcon, TagIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ModernHero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-4 sm:mx-6'>
            <div className='max-w-7xl mx-auto my-8 sm:my-12'>
                {/* Top announcement bar */}
                <div className='hidden md:flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm py-2 px-4 rounded-full mb-8 animate-pulse'>
                    <span className='font-medium'>🎉 Limited Time Offer:</span>
                    <span className='mx-2'>Free shipping on orders over {currency}50!</span>
                    <ChevronRightIcon size={16} className='ml-1' />
                </div>

                {/* Main hero section */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left column - Main hero content */}
                    <div className='lg:col-span-2'>
                        <div className='relative bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl p-6 sm:p-8 md:p-12 h-full flex flex-col justify-between overflow-hidden group'>
                            {/* Decorative elements */}
                            <div className='absolute -top-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full opacity-20'></div>
                            <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full opacity-20'></div>
                            
                            <div className='relative z-10'>
                                <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-indigo-600 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6'>
                                    <span className='bg-indigo-600 px-2.5 py-0.5 rounded-full text-white text-xs'>NEW</span> 
                                    Summer Collection 2025
                                </div>
                                
                                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 leading-tight max-w-md mb-4'>
                                    Discover the <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>Future</span> of Tech
                                </h1>
                                
                                <p className='text-slate-600 mb-6 max-w-lg'>
                                    Explore our curated collection of cutting-edge gadgets and smart devices designed to enhance your everyday life.
                                </p>
                                
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <Link href='/shop' className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5'>
                                        Shop Now
                                        <ArrowRightIcon size={18} />
                                    </Link>
                                    
                                    <Link href='/all-products' className='bg-white hover:bg-slate-50 text-slate-800 font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-slate-200 flex items-center justify-center gap-2 shadow hover:shadow-md'>
                                        View All Products
                                    </Link>
                                </div>
                            </div>
                            
                            <div className='relative z-10 mt-8'>
                                <div className='flex items-center gap-6'>
                                    <div className='flex items-center gap-2 text-slate-600'>
                                        <TruckIcon size={20} />
                                        <span className='text-sm'>Free Shipping</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-slate-600'>
                                        <TagIcon size={20} />
                                        <span className='text-sm'>Up to 50% Off</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-slate-600'>
                                        <ShoppingCartIcon size={20} />
                                        <span className='text-sm'>Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right column - Promotional cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6'>
                        <div className='relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 flex flex-col justify-between overflow-hidden group'>
                            <div className='absolute -top-10 -right-10 w-32 h-32 bg-amber-200 rounded-full opacity-30'></div>
                            <div className='relative z-10'>
                                <h3 className='text-xl font-bold text-slate-800 mb-2'>Best Sellers</h3>
                                <p className='text-slate-600 text-sm mb-4'>Top-rated products loved by our customers</p>
                                <Link href='/shop?sort=rating' className='inline-flex items-center gap-1 text-amber-600 font-medium text-sm hover:gap-2 transition-all'>
                                    Shop Now
                                    <ArrowRightIcon size={16} />
                                </Link>
                            </div>
                            <div className='relative z-10 mt-4 -mb-4 -mr-4'>
                                <Image 
                                    className='w-full max-w-[180px] ml-auto' 
                                    src={assets.hero_product_img1} 
                                    alt="Best selling product" 
                                />
                            </div>
                        </div>
                        
                        <div className='relative bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 flex flex-col justify-between overflow-hidden group'>
                            <div className='absolute -top-10 -right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-30'></div>
                            <div className='relative z-10'>
                                <h3 className='text-xl font-bold text-slate-800 mb-2'>New Arrivals</h3>
                                <p className='text-slate-600 text-sm mb-4'>Latest tech gadgets just launched</p>
                                <Link href='/shop?sort=newest' className='inline-flex items-center gap-1 text-emerald-600 font-medium text-sm hover:gap-2 transition-all'>
                                    Explore
                                    <ArrowRightIcon size={16} />
                                </Link>
                            </div>
                            <div className='relative z-10 mt-4 -mb-4 -mr-4'>
                                <Image 
                                    className='w-full max-w-[180px] ml-auto' 
                                    src={assets.hero_product_img2} 
                                    alt="New arrival product" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModernHero