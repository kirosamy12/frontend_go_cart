'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/Loading"
import { addCategory } from "@/lib/features/category/categorySlice"
import { toast } from "react-hot-toast"

export default function AddCategory() {
    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.category)

    const [categoryName, setCategoryName] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!isAuthenticated || !token) {
            toast.error("Please log in to add categories")
            return
        }

        if (!categoryName.trim()) {
            toast.error("Category name cannot be empty")
            return
        }

        try {
            await dispatch(addCategory({ name: categoryName })).unwrap()
            toast.success("Category added successfully")
            setCategoryName("")
        } catch (error) {
            toast.error("Failed to add category")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-semibold mb-6 text-slate-800">Add New <span className="text-blue-600">Category</span></h1>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Category Name
                <input type="text" name="name" onChange={e => setCategoryName(e.target.value)} value={categoryName} placeholder="Enter category name" className="w-full max-w-sm p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </label>

            <button disabled={loading} className="bg-blue-600 text-white px-6 mt-7 py-3 hover:bg-blue-700 rounded-md transition disabled:opacity-50">
                {loading ? "Adding..." : "Add Category"}
            </button>
        </form>
    )
}
