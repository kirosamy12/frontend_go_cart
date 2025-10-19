'use client'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/Loading"
import { addCategory } from "@/lib/features/category/categorySlice"
import { toast } from "react-hot-toast"

export default function AddCategory() {
    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.category)

    const [categoryName, setCategoryName] = useState("")
    const [categoryImage, setCategoryImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setCategoryImage(file)
            const reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result || "")
            }
            reader.onerror = () => {
                toast.error("Error reading image file")
                setCategoryImage(null)
                setImagePreview("")
            }
            reader.readAsDataURL(file)
        } else if (file) {
            toast.error("Please select a valid image file")
            setCategoryImage(null)
            setImagePreview("")
        }
    }

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

        if (!categoryImage) {
            toast.error("Category image is required")
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', categoryName)
            formData.append('image', categoryImage)

            await dispatch(addCategory(formData)).unwrap()
            toast.success("Category added successfully")
            setCategoryName("")
            setCategoryImage(null)
            setImagePreview("")
        } catch (error) {
            toast.error("Failed to add category")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-semibold mb-6 text-slate-800">Add New <span className="text-blue-600">Category</span></h1>

            <label htmlFor="categoryName" className="flex flex-col gap-2 my-6">
                Category Name
                <input
                    id="categoryName"
                    type="text"
                    name="name"
                    onChange={(e) => setCategoryName(e.target.value)}
                    value={categoryName}
                    placeholder="Enter category name"
                    className="w-full max-w-sm p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                />
            </label>

            <label htmlFor="categoryImage" className="flex flex-col gap-2 my-6">
                Category Image
                <input
                    id="categoryImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full max-w-sm p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                />
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Category preview" className="w-32 h-32 object-cover rounded-md border" />
                    </div>
                )}
            </label>

            <button disabled={loading} className="bg-blue-600 text-white px-6 mt-7 py-3 hover:bg-blue-700 rounded-md transition disabled:opacity-50">
                {loading ? "Adding..." : "Add Category"}
            </button>
        </form>
    )
}
