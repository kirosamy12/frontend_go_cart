'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import ModernLoading from "@/components/ModernLoading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPendingStores = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('https://go-cart-1bwm.vercel.app/api/admin/stores/pending', {
                headers: {
                    'token': token
                }
            })
            if (res.ok) {
                const data = await res.json()
                setStores(data.stores || [])
            } else {
                setStores([])
            }
        } catch (error) {
            console.error('Error fetching pending stores:', error)
            setStores([])
        }
        setLoading(false)
    }

    const updateStoreStatus = async (storeId, status) => {
        // Logic to update the status of a store
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/stores/${storeId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Remove the store from the list
                    setStores(prev => prev.filter(store => store.id !== storeId))
                    return Promise.resolve()
                }
            }
            return Promise.reject()
        } catch (error) {
            console.error('Error updating store status:', error)
            return Promise.reject()
        }
    }

    useEffect(() => {
        fetchPendingStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Approve <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(updateStoreStatus(store.id, 'approved'), { loading: "Approving..." })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">Approve</button>
                                <button onClick={() => toast.promise(updateStoreStatus(store.id, 'rejected'), { loading: "Rejecting..." })} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">Reject</button>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No pending stores</h1>
                </div>
            )
            }
        </div>
    ) : <ModernLoading />
}