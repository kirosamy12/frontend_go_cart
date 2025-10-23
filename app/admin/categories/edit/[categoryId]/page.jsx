'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, updateCategory } from '@/lib/features/category/categorySlice'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeftIcon, UploadIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function EditCategoryPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { categoryId } = useParams()
    const { categories, loading } = useSelector(state => state.category)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null
    })
    const [imagePreview, setImagePreview] = useState('')
    const [errors, setErrors] = useState({})
    const [category, setCategory] = useState(null)

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchCategories())
        }
    }, [dispatch, categories.length])

    useEffect(() => {
        if (categories.length > 0 && categoryId) {
            const foundCategory = categories.find(cat => (cat.id || cat._id) === categoryId)
            if (foundCategory) {
                setCategory(foundCategory)
                setFormData({
                    name: foundCategory.name || '',
                    description: foundCategory.description || '',
                    image: null
                })
                setImagePreview(foundCategory.image || '')
            }
        }
    }, [categories, categoryId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size should be less than 5MB'
                }))
                return
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file'
                }))
                return
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }))

            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)

            // Clear error
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }))
            }
        }
    }

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }))
        setImagePreview(category?.image || '')
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const submitData = new FormData()
            submitData.append('name', formData.name.trim())
            submitData.append('description', formData.description.trim())
            if (formData.image) {
                submitData.append('image', formData.image)
            }

            await dispatch(updateCategory({ id: categoryId, data: submitData })).unwrap()
            router.push('/admin/categories')
        } catch (error) {
            console.error('Failed to update category:', error)
            setErrors({ submit: 'Failed to update category. Please try again.' })
        }
    }

    if (loading && !category) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Category not found</p>
                <Link
                    href="/admin/categories"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                >
                    Back to Categories
                </Link>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/categories"
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Category</h1>
                    <p className="text-slate-600">Update category information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter category name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.description ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter category description"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category Image
                    </label>
                    <div className="space-y-4">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative inline-block">
                                <Image
                                    src={imagePreview}
                                    alt="Category preview"
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-cover border border-slate-300"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors">
                                <UploadIcon size={18} />
                                Change Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-sm text-slate-500">PNG, JPG up to 5MB</span>
                        </div>

                        {errors.image && (
                            <p className="text-sm text-red-600">{errors.image}</p>
                        )}
                    </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Updating Category...' : 'Update Category'}
                    </button>
                    <Link
                        href="/admin/categories"
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}
