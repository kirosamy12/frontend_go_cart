'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { addProduct } from "@/lib/features/product/productSlice"
import { fetchCategories } from "@/lib/features/category/categorySlice"

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
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setProductInfo({
            ...productInfo,
            [name]: value
        })
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
    }

    const removeImage = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!isAuthenticated || !token) {
                toast.error("Please log in to add products")
                setLoading(false)
                return
            }

            if (images.length === 0) {
                toast.error("Please upload at least one image")
                setLoading(false)
                return
            }

            // Create FormData
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('price', productInfo.price)
            formData.append('mrp', productInfo.mrp)
            formData.append('category', productInfo.category)
            formData.append('inStock', productInfo.inStock)

            // Append images
            images.forEach((image, index) => {
                formData.append('images', image)
            })

            // Dispatch action
            await dispatch(addProduct({ productData: formData, token })).unwrap()
            toast.success("Product added successfully!")

            // Reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
                inStock: true,
            })
            setImages([])

        } catch (error) {
            console.error("Error adding product:", error)
            toast.error(error.message || "Failed to add product")
        } finally {
            setLoading(false)
        }
    }

    if (categoriesLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="w-11 h-11 rounded-full border-3 border-gray-300 border-t-green-500 animate-spin"></div>
        </div>
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5 w-full max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>

            <div className="flex flex-wrap gap-4 w-full">
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
                    onChange={(e) => setProductInfo({ ...productInfo, inStock: e.target.checked })}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span>In Stock</span>
            </label>

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