import React from 'react'
import Title from './Title'
import { MailIcon } from 'lucide-react'

const Newsletter = () => {
    return (
        <div className='py-16 bg-gradient-to-r from-indigo-500 to-purple-600'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center'>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 mx-auto">
                    <MailIcon size={24} className="text-white" />
                </div>
                
                <Title 
                    title="Stay in the Loop" 
                    description="Subscribe to our newsletter and be the first to know about new product launches, exclusive deals, and tech insights." 
                    visibleButton={false} 
                />
                
                <div className='flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8'>
                    <input 
                        className='flex-1 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50' 
                        type="email" 
                        placeholder='Enter your email address' 
                    />
                    <button className='bg-white text-indigo-600 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl'>
                        Subscribe
                    </button>
                </div>
                
                <p className="text-indigo-200 text-sm mt-4">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    )
}

export default Newsletter