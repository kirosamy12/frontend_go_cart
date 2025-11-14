'use client'
import Image from 'next/image'
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { Trash2 } from 'lucide-react'

const WishlistItem = ({ product }) => {
    const dispatch = useDispatch()

    const handleRemove = () => {
        dispatch(removeFromWishlist({ productId: product.id }))
    }

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'

    return (
        <div className="border border-slate-200 rounded p-4 flex flex-col">
            <div className="relative h-48 w-full mb-4">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded" />
            </div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-slate-600 mb-4">{currency}{product.price}</p>
            <button
                onClick={handleRemove}
                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-800 transition font-semibold"
            >
                <Trash2 size={16} />
                Remove
            </button>
        </div>
    )
}

export default WishlistItem
