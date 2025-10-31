'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')

    // Format date in a way that avoids hydration issues
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product.description || 'No description available'}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-14">
                    {product.rating && product.rating.length > 0 ? product.rating.map((item,index) => (
                        <div key={index} className="flex gap-5 mb-10">
                            {item.user && item.user.image && (
                                <Image src={item.user.image} alt="" className="size-10 rounded-full" width={100} height={100} />
                            )}
                            <div>
                                <div className="flex items-center" >
                                    {Array(5).fill('').map((_, index) => (
                                        <StarIcon key={index} size={18} className='text-transparent mt-0.5' fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                    ))}
                                </div>
                                <p className="text-sm max-w-lg my-4">{item.review || 'No review text'}</p>
                                <p className="font-medium text-slate-800">{item.user ? item.user.name : 'Anonymous'}</p>
                                <p className="mt-3 font-light">{formatDate(item.createdAt)}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-500">No reviews yet</p>
                    )}
                </div>
            )}

            {/* Store Page */}
            {product.store && (
                <div className="flex gap-3 mt-14">
                    {product.store.logo && (
                        <Image src={product.store.logo} alt="" className="size-11 rounded-full ring ring-slate-400" width={100} height={100} />
                    )}
                    <div>
                        <p className="font-medium text-slate-600">Product by {product.store.name || 'Unknown Store'}</p>
                        {product.store.username && (
                            <Link href={`/shop/${product.store.username}`} className="flex items-center gap-1.5 text-green-500"> view store <ArrowRight size={14} /></Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDescription