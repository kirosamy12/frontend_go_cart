'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import ModernLoading from "@/components/ModernLoading"
import { PlusIcon } from "lucide-react"
import toast from "react-hot-toast"

export default function AddProduct() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.auth)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)
    const [error, setError] = useState(null)

    const storeId = user?.storeId || user?.store?.id || user?.store?._id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: [],
    })

    const fetchCategories = async () => {
        try {
            setDataLoading(true)
            setError(null)
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            if (!storeId) {
                throw new Error('Store ID not found. Please create a store first.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/${storeId}/categories`, {
                headers: {
                    'token': token,
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get categories')
            
            setCategories(data.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
            setError(error.message || 'Failed to fetch categories. Please try again later.')
        } finally {
            setDataLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setFormData({
            ...formData,
            images: [...formData.images, ...files]
        })
    }

    const removeImage = (index) => {
        const newImages = [...formData.images]
        newImages.splice(index, 1)
        setFormData({
            ...formData,
            images: newImages
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            if (!storeId) {
                throw new Error('Store ID not found. Please create a store first.')
            }

            // Validate form data
            if (!formData.name.trim()) {
                throw new Error('Product name is required.')
            }

            if (!formData.description.trim()) {
                throw new Error('Product description is required.')
            }

            if (!formData.price || formData.price <= 0) {
                throw new Error('Valid product price is required.')
            }

            if (formData.stock === '' || formData.stock < 0) {
                throw new Error('Valid stock quantity is required.')
            }

            if (!formData.categoryId) {
                throw new Error('Please select a category.')
            }

            if (formData.images.length === 0) {
                throw new Error('At least one product image is required.')
            }

            // Create FormData for file upload
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('price', formData.price)
            formDataToSend.append('stock', formData.stock)
            formDataToSend.append('categoryId', formData.categoryId)
            
            // Append images
            formData.images.forEach((image) => {
                formDataToSend.append('images', image)
            })

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/${storeId}/products`, {
                method: 'POST',
                headers: {
                    'token': token,
                },
                body: formDataToSend
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                } else if (response.status === 400) {
                    throw new Error(errorData.message || 'Invalid product data. Please check your input and try again.')
                } else if (response.status === 409) {
                    throw new Error(errorData.message || 'A product with this name already exists.')
                } else if (response.status === 413) {
                    throw new Error('Product images are too large. Please reduce image sizes and try again.')
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to create product')
            
            toast.success('Product created successfully!')
            router.push('/store/manage-product')
        } catch (error) {
            console.error('Error creating product:', error)
            setError(error.message || 'Failed to create product. Please check your connection and try again.')
            toast.error(error.message || 'Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    if (!token || !storeId) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="text-center py-12">
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Access Denied</h3>
                        <p className="text-gray-500">
                            {token 
                                ? "Store not found. Please create a store first." 
                                : "Please sign in to access this page."}
                        </p>
                        <button 
                            onClick={() => router.push(token ? '/create-store' : '/signin')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            {token ? "Create Store" : "Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (dataLoading) {
        return <ModernLoading />
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl text-slate-800 font-semibold mb-6">Add <span className="text-blue-600">Product</span></h1>
            
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter product name"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                Price (in cents)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter price in cents"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter stock quantity"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
                            Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Product Images
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mb-2 text-sm text-slate-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        
                        {formData.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <div className="bg-slate-200 border-2 border-dashed rounded-lg w-full h-20" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/store/manage-product')}
                            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusIcon size={18} />
                                    Create Product
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}