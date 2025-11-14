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

    const [searchTerm, setSearchTerm] = useState('')
    const [stockFilter, setStockFilter] = useState('all') // 'all', 'inStock', 'outOfStock'

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchStoreProducts())
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
                toast.error(error.message || "Failed to update stock status")
            })
    }

    const handleEdit = (id) => {
        router.push(`/store/edit-product/${id}`)
    }

    const router = useRouter()

    // Filter products based on search term and stock filter
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'inStock' && product.inStock) ||
            (stockFilter === 'outOfStock' && !product.inStock)

        return matchesSearch && matchesStock
    })

    if (loading) return <ModernLoading />
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>

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

            {filteredProducts.length === 0 ? (
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
                                <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                                    <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
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
                                                onChange={() => toggleStock(product.id)}
                                                checked={product.inStock}
                                                disabled={!isAuthenticated}
                                            />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200 disabled:opacity-50"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                        <button
                                            onClick={() => handleEdit(product.id)}
                                            disabled={!isAuthenticated}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={!isAuthenticated}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}