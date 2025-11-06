'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import ProductReviews from "@/components/ProductReviews"

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
                <ProductReviews productId={product.id || product._id} />
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