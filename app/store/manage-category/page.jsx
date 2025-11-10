'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import ModernLoading from "@/components/ModernLoading"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"
import toast from "react-hot-toast"

export default function ManageCategory() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.auth)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const storeId = user?.storeId || user?.store?.id || user?.store?._id;

    const fetchCategories = async () => {
        try {
            setLoading(true)
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
            setLoading(false)
        }
    }

    const deleteCategory = async (categoryId) => {
        try {
            if (!token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'token': token,
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to delete category')
            
            // Remove the category from the local state
            setCategories(prev => prev.filter(category => category.id !== categoryId))
            toast.success('Category deleted successfully!')
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error(error.message || 'Failed to delete category. Please try again later.')
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

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

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl text-slate-800 font-semibold">Manage <span className="text-blue-600">Categories</span></h1>
                <button 
                    onClick={() => router.push('/store/add-category')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                    <PlusIcon size={18} />
                    Add Category
                </button>
            </div>
            
            {error && (
                <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Categories</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 font-medium mb-2">Troubleshooting Tips:</p>
                            <ul className="text-left text-sm text-yellow-700 space-y-1 max-w-md mx-auto">
                                <li key="tip1">• Check your internet connection</li>
                                <li key="tip2">• Verify the API server is running</li>
                                <li key="tip3">• Try refreshing the page</li>
                                <li key="tip4">• Ensure you have proper permissions</li>
                            </ul>
                        </div>
                        
                        <button
                            onClick={fetchCategories}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <ModernLoading />
            ) : !error && categories && categories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
                        <p className="text-gray-500">You haven't added any categories yet.</p>
                        <button 
                            onClick={() => router.push('/store/add-category')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            Add Your First Category
                        </button>
                    </div>
                </div>
            ) : !error && categories ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => router.push(`/store/edit-category/${category.id}`)}
                                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit Category"
                                    >
                                        <EditIcon size={18} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this category?')) {
                                                toast.promise(deleteCategory(category.id), {
                                                    loading: "Deleting category...",
                                                    success: "Category deleted successfully!",
                                                    error: "Failed to delete category"
                                                })
                                            }
                                        }}
                                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Category"
                                    >
                                        <TrashIcon size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm">{category.description || 'No description provided'}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}