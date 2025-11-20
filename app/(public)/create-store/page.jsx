'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import ModernLoading from "@/components/ModernLoading"
import { createShop } from "@/lib/features/auth/authSlice"
import toast from "react-hot-toast"
import { Store, Upload, Building2, User, FileText, MapPin, Phone, Mail, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

export default function CreateStore() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { isAuthenticated, user, token, loading } = useSelector(state => state.auth)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        description: '',
        address: '',
        contact: '',
        email: '',
    })
    const [logo, setLogo] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin')
        } else if (user?.storeId || user?.store) {
            router.push('/store')
        }
    }, [isAuthenticated, user, router])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setLogo(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const resultAction = await dispatch(createShop({ shopData: formData, logo, token })).unwrap()

            if (resultAction.success) {
                toast.success('Your store has been created and is now pending approval.')

                setTimeout(() => {
                    router.push('/home')
                }, 2000)
            } else {
                toast.error(resultAction.message || 'Failed to create store')
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create store')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ModernLoading />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
                        <Store className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        Create Your Store
                    </h2>
                    <p className="text-slate-600">
                        Set up your online shop in minutes and start selling
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Store Logo
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <Image 
                                                src={logoPreview} 
                                                alt="Logo preview" 
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
                                            <Upload className="w-4 h-4" />
                                            Upload Logo
                                        </div>
                                    </label>
                                    <p className="text-xs text-slate-500 mt-2">
                                        PNG, JPG up to 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6"></div>

                        {/* Store Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Store Name *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="My Awesome Store"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                                Store Username *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="mystore"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                This will be your store URL: yoursite.com/<span className="text-indigo-600">{formData.username || 'username'}</span>
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                Description *
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                                    placeholder="Tell customers about your store..."
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                                Address *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>
                        </div>

                        {/* Contact & Email Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Contact */}
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-2">
                                    Contact Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="contact"
                                        name="contact"
                                        type="tel"
                                        required
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="store@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Store...
                                    </>
                                ) : (
                                    <>
                                        <Store className="w-5 h-5" />
                                        Create Store
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    By creating a store, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}
