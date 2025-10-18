'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { fetchStoreProductsByUsername } from "@/lib/features/product/productSlice"


export default function StoreShop() {

    const { username } = useParams()
    const dispatch = useDispatch()
    const { storeProductsByUsername, loading: productsLoading, error } = useSelector(state => state.product)
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStoreData = async () => {
        try {
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/${username}`)
            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    setStoreInfo(data.store)
                } else {
                    setStoreInfo(null)
                }
            } else {
                setStoreInfo(null)
            }
        } catch (error) {
            console.error('Error fetching store data:', error)
            setStoreInfo(null)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (username) {
            fetchStoreData()
            dispatch(fetchStoreProductsByUsername(username))
        }
    }, [username, dispatch])

    if (loading || productsLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">

            {/* Store Info Banner */}
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <Image
                        src={storeInfo.logo || '/placeholder-image.jpg'}
                        alt={storeInfo.name || 'Store'}
                        className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
                        width={200}
                        height={200}
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name || 'Store Name'}</h1>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description || 'No description available'}</p>
                        <div className="text-xs text-slate-500 mt-4 space-y-1"></div>
                        <div className="space-y-2 text-sm text-slate-500">
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.address || 'No address'}</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.email || 'No email'}</span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className=" max-w-7xl mx-auto mb-40">
                <h1 className="text-2xl mt-12">Shop <span className="text-slate-800 font-medium">Products</span></h1>
                <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                    {storeProductsByUsername.length > 0 ? (
                        storeProductsByUsername.map((product) => <ProductCard key={product.id || product._id} product={product} />)
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500">No products available for this store</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
