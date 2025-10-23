'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { addProduct } from "@/lib/features/product/productSlice"
import { fetchCategories } from "@/lib/features/category/categorySlice"
import ColorPicker from "@/components/ColorPicker"

export default function StoreAddProduct() {

    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { list: categories, loading: categoriesLoading } = useSelector(state => state.category)

    const [images, setImages] = useState([])
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        inStock: true,
        colors: [],
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const onChangeHandler = (e) => {
        const { name, value, type, checked } = e.target
        setProductInfo({
            ...productInfo,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        const newImages = [...images]

        files.forEach(file => {
            if (newImages.length < 4) {
                newImages.push(file)
            }
        })

        setImages(newImages)
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Check if user is authenticated
            if (!isAuthenticated || !token) {
                toast.error("Please log in to add products")
                setLoading(false)
                return
            }

            // Validate required fields
            if (!productInfo.name || !productInfo.description || !productInfo.category) {
                toast.error("Please fill in all required fields")
                setLoading(false)
                return
            }

            if (productInfo.mrp <= 0 || productInfo.price <= 0) {
                toast.error("Prices must be greater than 0")
                setLoading(false)
                return
            }

            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp.toString())
            formData.append('price', productInfo.price.toString())
            formData.append('category', productInfo.category)
            formData.append('inStock', productInfo.inStock.toString())

            // Add colors as array
            productInfo.colors.forEach(color => {
                formData.append('colors', color)
            })

            // Add images as array
            images.forEach(image => {
                formData.append('images', image)
            })

            const result = await dispatch(addProduct(formData)).unwrap()
            toast.success("Product added successfully!")
            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "", inStock: true, colors: [] })
            setImages([])
        } catch (error) {
            console.error('Product addition error:', error)

            // Handle specific error types
            if (error.includes('Authentication failed') || error.includes('No authentication token')) {
                toast.error("Authentication failed. Please log in again.")
            } else if (error.includes('Failed to add product')) {
                toast.error("Failed to add product. Please check your input and try again.")
            } else {
                toast.error(error || "Failed to add product. Please check your connection and try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-semibold mb-6 text-slate-800">Add New <span className="text-blue-600">Product</span></h1>
            <p className="mt-7 font-medium text-slate-700">Product Images</p>

            <div className="flex gap-3 mt-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={URL.createObjectURL(image)} alt="" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {images.length < 4 && (
                    <label htmlFor="images" className="cursor-pointer">
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={assets.upload_area} alt="" />
                        <input
                            type="file"
                            accept='image/*'
                            id="images"
                            multiple
                            onChange={handleImageUpload}
                            hidden
                        />
                    </label>
                )}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-3 outline-none border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-3 my-6 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select a category</option>
                {categoriesLoading ? (
                    <option disabled>Loading categories...</option>
                ) : (
                    categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                )}
            </select>

            <label className="flex items-center gap-3 my-6">
                <input
                    type="checkbox"
                    name="inStock"
                    checked={productInfo.inStock}
                    onChange={onChangeHandler}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span>In Stock</span>
            </label>

            <ColorPicker
                colors={productInfo.colors}
                onChange={(colors) => setProductInfo({ ...productInfo, colors })}
            />

            <br />

            <button
                disabled={loading || !isAuthenticated || categoriesLoading}
                className="bg-blue-600 text-white px-6 mt-7 py-3 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add Product"}
            </button>

            {!isAuthenticated && (
                <p className="text-red-500 text-sm mt-2">Please log in to add products</p>
            )}
        </form>
    )
}
