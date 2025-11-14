'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ModernLoading from "@/components/ModernLoading"
import { fetchStoreProducts, deleteProduct, toggleProductStock } from "@/lib/features/product/productSlice"
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react"

export default function StoreManageProducts() {

    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { list: products, loading, error } = useSelector(state => state.product)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'EGP'
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState('')
    const [stockFilter, setStockFilter] = useState('all') // 'all', 'inStock', 'outOfStock'

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchStoreProducts())
                .unwrap()
                .catch((error) => {
                    console.error('Error fetching products:', error)
                    toast.error(error.message || "Failed to fetch products")
                })
        }
    }, [dispatch, isAuthenticated, token])

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => {
                    toast.success("Product deleted successfully!")
                })
                .catch((error) => {
                    console.error('Error deleting product:', error)
                    toast.error(error.message || "Failed to delete product")
                })
        }
    }

    const toggleStock = (id) => {
        dispatch(toggleProductStock(id))
            .unwrap()
            .then(() => {
                toast.success("Stock status updated!")
            })
            .catch((error) => {
                console.error('Error updating stock status:', error)
                toast.error(error.message || "Failed to update stock status")
            })
    }

    const handleEdit = (id) => {
        router.push(`/store/edit-product/${id}`)
    }

    // Filter products based on search term and stock filter
    const filteredProducts = products ? products.filter(product => {
        // Handle potential null or undefined product
        if (!product) return false;
        
        const matchesSearch = (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'inStock' && product.inStock) ||
            (stockFilter === 'outOfStock' && !product.inStock)

        return matchesSearch && matchesStock
    }) : []

    if (loading) return <ModernLoading />
    
    if (error) {
        console.error('Manage products error:', error)
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-900">Error Loading Products</h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
                <button
                    onClick={() => router.push('/store/add-product')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    <PlusIcon size={18} />
                    Add Product
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FilterIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Products</option>
                        <option value="inStock">In Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {!products || filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || stockFilter !== 'all'
                            ? "No products match your search criteria."
                            : "Get started by adding a new product."}
                    </p>
                    <button
                        onClick={() => router.push('/store/add-product')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add Product
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-500">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                    <table className="min-w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3 hidden md:table-cell">Description</th>
                                <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {filteredProducts.map((product) => (
                                // Handle potential null or undefined product
                                product ? (
                                    <tr key={product.id || product._id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 items-center">
                                                {product.images && product.images[0] ? (
                                                    <Image 
                                                        width={40} 
                                                        height={40} 
                                                        className='p-1 shadow rounded cursor-pointer' 
                                                        src={product.images[0]} 
                                                        alt={product.name || "Product"} 
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="truncate max-w-xs">{product.name || 'Unnamed Product'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                                            {product.description || 'No description'}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {currency} {product.mrp ? product.mrp.toLocaleString() : '0'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {currency} {product.price ? product.price.toLocaleString() : '0'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                product.inStock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center flex gap-2 justify-center">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    onChange={() => toggleStock(product.id || product._id)}
                                                    checked={product.inStock}
                                                    disabled={!isAuthenticated}
                                                />
                                                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200 disabled:opacity-50"></div>
                                                <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                            </label>
                                            <button
                                                onClick={() => handleEdit(product.id || product._id)}
                                                disabled={!isAuthenticated}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id || product._id)}
                                                disabled={!isAuthenticated}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}