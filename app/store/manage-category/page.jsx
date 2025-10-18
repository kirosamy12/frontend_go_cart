'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories, deleteCategory } from "@/lib/features/category/categorySlice"
import { toast } from "react-hot-toast"
import Image from "next/image"

export default function StoreManageCategory() {

    const dispatch = useDispatch()
    const { list: categories, loading, error } = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return
        try {
            await dispatch(deleteCategory(id)).unwrap()
            toast.success("Category deleted successfully!")
        } catch (err) {
            console.error('Delete category error:', err)
            toast.error(err?.message || err || "Failed to delete category")
        }
    }

    if (loading) return <p>Loading categories...</p>
    if (error) return <p className="text-red-600">Error: {error}</p>

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 text-slate-700 mb-28">
            <h1 className="text-3xl font-semibold mb-6 text-slate-800">Manage <span className="text-blue-600">Categories</span></h1>
            <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <Image src={category.image} alt={category.name} width={40} height={40} className="w-10 h-10 object-cover rounded" />
                            </td>
                            <td className="px-4 py-3">{category.name}</td>
                            <td className="px-4 py-3 max-w-md truncate">{category.description}</td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => handleDelete(category.slug)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
