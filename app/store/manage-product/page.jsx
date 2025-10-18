'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import { fetchStoreProducts, deleteProduct, toggleProductStock } from "@/lib/features/product/productSlice"
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react"

export default function StoreManageProducts() {

    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { list: products, loading, error } = useSelector(state => state.product)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [searchTerm, setSearchTerm] = useState('')
    const [stockFilter, setStockFilter] = useState('all') // 'all', 'inStock', 'outOfStock'

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchStoreProducts())
        }
    }, [dispatch, isAuthenticated, token])

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'inStock' && product.inStock) ||
            (stockFilter === 'outOfStock' && !product.inStock)
        return matchesSearch && matchesStock
    })

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            // Check authentication before deleting
            if (!isAuthenticated || !token) {
                toast.error("Please log in to manage products")
                return
            }

            await dispatch(deleteProduct(id)).unwrap()
            toast.success("Product deleted successfully!")
        } catch (err) {
            console.error('Delete product error:', err)

            // Handle specific error types
            if (err.includes('Authentication failed') || err.includes('No authentication token')) {
                toast.error("Authentication failed. Please log in again.")
            } else {
                toast.error(err || "Failed to delete product")
            }
        }
    }

    const router = useRouter()

    const toggleStock = async (productId) => {
        try {
            // Check authentication before toggling stock
            if (!isAuthenticated || !token) {
                toast.error("Please log in to manage products")
                return
            }

            await dispatch(toggleProductStock(productId)).unwrap()
            toast.success("Product stock status updated!")
        } catch (err) {
            console.error('Toggle stock error:', err)

            // Handle specific error types
            if (err.includes('Authentication failed') || err.includes('No authentication token')) {
                toast.error("Authentication failed. Please log in again.")
            } else {
                toast.error(err || "Failed to update stock status")
            }
        }
    }

    const handleEdit = (productId) => {
        router.push(`/store/edit-product/${productId}`)
    }

    if (loading) return <Loading />
    if (error) return <p className="text-red-600">Error: {error}</p>

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>

            {!isAuthenticated && (
                <p className="text-red-500 text-sm mb-4">Please log in to manage products</p>
            )}

            {products.length === 0 && !loading ? (
                <p className="text-slate-500 text-center py-8">No products found. Add some products to get started.</p>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                        <div className="flex items-center gap-2">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FilterIcon className="w-5 h-5 text-gray-400" />
                            <select
                                value={stockFilter}
                                onChange={e => setStockFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="inStock">In Stock</option>
                                <option value="outOfStock">Out of Stock</option>
                            </select>
                        </div>
                        <button
                            onClick={() => router.push('/store/add-product')}
                            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                    <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
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
