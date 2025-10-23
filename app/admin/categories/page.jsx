'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, deleteCategory } from '@/lib/features/category/categorySlice'
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CategoriesPage() {
    const dispatch = useDispatch()
    const { categories, loading, error } = useSelector(state => state.category)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCategories, setFilteredCategories] = useState([])

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        if (categories) {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredCategories(filtered)
        }
    }, [categories, searchTerm])

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await dispatch(deleteCategory(categoryId)).unwrap()
                dispatch(fetchCategories()) // Refresh the list
            } catch (error) {
                console.error('Failed to delete category:', error)
                alert('Failed to delete category. Please try again.')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error loading categories: {error}</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Categories Management</h1>
                    <p className="text-slate-600">Manage all product categories</p>
                </div>
                <Link
                    href="/admin/categories/add"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon size={18} />
                    Add Category
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <div key={category.id || category._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-slate-100">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-slate-800 mb-2">{category.name}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{category.description || 'No description'}</p>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500">
                                    {category.productCount || 0} products
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/categories/edit/${category.id || category._id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit category"
                                    >
                                        <PencilIcon size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id || category._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete category"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                        <SearchIcon size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
                    <p className="text-slate-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first category.'}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/admin/categories/add"
                            className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon size={18} />
                            Add Category
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}
