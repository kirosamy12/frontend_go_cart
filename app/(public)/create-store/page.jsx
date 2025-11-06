'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { updateUserRole } from "@/lib/features/auth/authSlice"
import { StoreIcon, UploadIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon, InfoIcon } from "lucide-react"

export default function CreateStore() {

    const { isAuthenticated, token } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        // Logic to check if the store is already submitted
        try {
            const res = await fetch('https://go-cart-1bwm.vercel.app/api/user/store', {
                headers: {
                    'token': token
                }
            })
            if (res.ok) {
                const data = await res.json()
                if (data.store) {
                    setAlreadySubmitted(true)
                    setStatus(data.store.status)
                    setMessage(`Your store "${data.store.name}" is currently ${data.store.status}.`)
                }
            }
        } catch (error) {
            console.error('Error fetching store status:', error)
        }
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to submit the store details
        try {
            const formData = new FormData()
            formData.append('name', storeInfo.name)
            formData.append('username', storeInfo.username)
            formData.append('description', storeInfo.description)
            formData.append('email', storeInfo.email)
            formData.append('contact', storeInfo.contact)
            formData.append('address', storeInfo.address)
            if (storeInfo.image) {
                formData.append('logo', storeInfo.image)
            }

            const res = await fetch('https://go-cart-1bwm.vercel.app/api/createStore', {
                method: 'POST',
                headers: {
                    'token': token
                },
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Update user role to 'store'
                    dispatch(updateUserRole('store'))

                    setAlreadySubmitted(true)
                    setStatus(data.store.status)
                    setMessage(`Your store "${data.store.name}" has been submitted and is currently ${data.store.status}.`)
                    // Redirect to store dashboard page after 3 seconds
                    setTimeout(() => {
                        router.push('/store')
                    }, 3000)
                } else {
                    toast.error('Failed to submit store')
                }
            } else {
                toast.error('Failed to submit store')
            }
        } catch (error) {
            toast.error('Error submitting store')
            console.error('Error submitting store:', error)
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin')
            return
        }
        fetchSellerStatus()
    }, [isAuthenticated, router])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                                <StoreIcon size={32} className="text-indigo-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Create Your Store</h1>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Join thousands of sellers on ShopVerse and start growing your business today
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting store details..." })} className="space-y-8">
                                    {/* Store Logo Section */}
                                    <div className="border-b border-slate-200 pb-8">
                                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                            <UploadIcon size={20} className="text-indigo-600" />
                                            Store Logo
                                        </h2>
                                        <label className="cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <Image 
                                                        src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} 
                                                        className="rounded-xl object-cover border-2 border-dashed border-slate-300" 
                                                        alt="Store logo preview" 
                                                        width={120} 
                                                        height={120} 
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <UploadIcon size={24} className="text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Upload Logo</p>
                                                    <p className="text-sm text-slate-500">PNG, JPG up to 2MB</p>
                                                </div>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} 
                                                hidden 
                                            />
                                        </label>
                                    </div>

                                    {/* Store Information */}
                                    <div className="border-b border-slate-200 pb-8">
                                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                            <InfoIcon size={20} className="text-indigo-600" />
                                            Store Information
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Store Name *</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <StoreIcon size={18} className="text-slate-400" />
                                                    </div>
                                                    <input 
                                                        name="name" 
                                                        onChange={onChangeHandler} 
                                                        value={storeInfo.name} 
                                                        type="text" 
                                                        placeholder="Enter your store name" 
                                                        className="pl-10 w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Store Username *</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <UserIcon size={18} className="text-slate-400" />
                                                    </div>
                                                    <input 
                                                        name="username" 
                                                        onChange={onChangeHandler} 
                                                        value={storeInfo.username} 
                                                        type="text" 
                                                        placeholder="Enter your store username" 
                                                        className="pl-10 w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Store Description *</label>
                                            <textarea 
                                                name="description" 
                                                onChange={onChangeHandler} 
                                                value={storeInfo.description} 
                                                rows={4} 
                                                placeholder="Describe your store and the products you sell" 
                                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none" 
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="border-b border-slate-200 pb-8">
                                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                            <MailIcon size={20} className="text-indigo-600" />
                                            Contact Information
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MailIcon size={18} className="text-slate-400" />
                                                    </div>
                                                    <input 
                                                        name="email" 
                                                        onChange={onChangeHandler} 
                                                        value={storeInfo.email} 
                                                        type="email" 
                                                        placeholder="Enter your store email" 
                                                        className="pl-10 w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number *</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <PhoneIcon size={18} className="text-slate-400" />
                                                    </div>
                                                    <input 
                                                        name="contact" 
                                                        onChange={onChangeHandler} 
                                                        value={storeInfo.contact} 
                                                        type="text" 
                                                        placeholder="Enter your contact number" 
                                                        className="pl-10 w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Store Address *</label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-3">
                                                    <MapPinIcon size={18} className="text-slate-400" />
                                                </div>
                                                <textarea 
                                                    name="address" 
                                                    onChange={onChangeHandler} 
                                                    value={storeInfo.address} 
                                                    rows={3} 
                                                    placeholder="Enter your store address" 
                                                    className="pl-10 w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none" 
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button 
                                            type="submit" 
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                                        >
                                            Create Store
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => router.push('/')}
                                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                            <div className="flex items-start gap-4">
                                <InfoIcon size={24} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-2">After Submission</h3>
                                    <p className="text-slate-600">
                                        Your store will be reviewed by our team within 2-3 business days. 
                                        You'll receive an email notification once your store is approved and ready to go live.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">Store Submitted Successfully!</h1>
                        <p className="text-xl text-slate-600 mb-8">{message}</p>
                        
                        {status === "approved" ? (
                            <div className="space-y-4">
                                <p className="text-slate-500">Redirecting to your store dashboard in <span className="font-semibold">3 seconds</span></p>
                                <button 
                                    onClick={() => router.push('/store')}
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
                                >
                                    Go to Dashboard
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.33398 8H12.6673M12.6673 8L8.00065 3.33333M12.6673 8L8.00065 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-slate-500">You'll receive an email notification once your store is approved.</p>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
                                >
                                    Back to Home
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.33398 8H12.6673M12.6673 8L8.00065 3.33333M12.6673 8L8.00065 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    ) : (<Loading />)
}