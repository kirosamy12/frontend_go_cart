'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)


    const fetchStores = async () => {
        try {
            const res = await fetch('https://go-cart-1bwm.vercel.app/api/admin/stores/pending', {
                headers: {
                    // Add admin token if needed
                }
            })
            if (res.ok) {
                const data = await res.json()
                setStores(data.stores || [])
            } else {
                setStores([])
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            setStores([])
        }
        setLoading(false)
    }

    const handleApprove = async ({ storeId, status }) => {
        // Logic to approve a store
        try {
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/stores/${storeId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add admin token if needed
                },
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Update local state or refetch stores
                    setStores(prev => prev.filter(store => store.id !== storeId))
                    return Promise.resolve()
                }
            }
            return Promise.reject()
        } catch (error) {
            console.error('Error approving store:', error)
            return Promise.reject()
        }
    }

    useEffect(() => {
            fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Approve <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                    Approve
                                </button>
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No Application Pending</h1>
                </div>
            )}
        </div>
    ) : <Loading />
}