'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center text-center'>
            <h2 className='text-3xl font-bold text-slate-800 mb-3'>{title}</h2>
            <p className='text-slate-600 max-w-2xl mb-6'>{description}</p>
            {visibleButton && (
                <Link 
                    href={href} 
                    className='inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium group'
                >
                    View more
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    )
}

export default Title