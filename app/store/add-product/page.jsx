'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { addProduct } from "@/lib/features/product/productSlice"
import { fetchCategories } from "@/lib/features/category/categorySlice"
import ColorPicker from "@/components/ColorPicker"
import ModernLoading from "@/components/ModernLoading"

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
        sizes: [], // Add sizes array
    })

    const [newSize, setNewSize] = useState("")
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        const { name, value, type, checked } = e.target
        setProductInfo({
            ...productInfo,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSizeChange = (e) => {
        setNewSize(e.target.value)
    }

    const addSize = () => {
        if (newSize.trim() && !productInfo.sizes.includes(newSize.trim())) {
            setProductInfo({
                ...productInfo,
                sizes: [...productInfo.sizes, newSize.trim()]
            })
            setNewSize("")
        }
    }

    const removeSize = (sizeToRemove) => {
        setProductInfo({
            ...productInfo,
            sizes: productInfo.sizes.filter(size => size !== sizeToRemove)
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
            formData.append('colors', JSON.stringify(productInfo.colors))
            formData.append('sizes', JSON.stringify(productInfo.sizes))

            // Append images as an array - this is the key fix
            // Append each image with the same field name so the backend receives them as an array
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
                colors: [],
                sizes: [],
            })
            setImages([])
            setNewSize("")

        } catch (error) {
            console.error("Error adding product:", error)
            toast.error(error.message || "Failed to add product")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    if (categoriesLoading) {
        return <ModernLoading />
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5 w-full max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>

            <div className="flex flex-wrap gap-4 w-full">
                {images[0] ? (
                    <label htmlFor="image" className="cursor-pointer">
                        <Image
                            src={URL.createObjectURL(images[0])}
                            width={200}
                            height={200}
                            alt="Product Image"
                            className="rounded-md object-cover border border-gray-300"
                        />
                        <input onChange={handleImageUpload} type="file" id="image" hidden multiple />
                    </label>
                ) : (
                    <label htmlFor="image" className="cursor-pointer w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                        <Image src={assets.upload_area} width={50} height={50} alt="Upload Area" />
                        <input onChange={handleImageUpload} type="file" id="image" hidden multiple />
                    </label>
                )}

                {images.slice(1).map((image, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={URL.createObjectURL(image)}
                            width={100}
                            height={100}
                            alt={`Product Image ${index + 2}`}
                            className="rounded-md object-cover border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="" className="flex flex-col gap-2">
                    Product Title
                    <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Type here" className="w-full p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2">
                    Product Description
                    <textarea onChange={onChangeHandler} value={productInfo.description} name="description" placeholder="Write content here" rows={5} className="w-full p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </label>
            </div>

            <div className="flex flex-wrap gap-6 w-full">
                <label htmlFor="" className="flex flex-col gap-2">
                    Regular Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
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

            {/* Size Selection */}
            <div className="my-6">
                <label className="flex flex-col gap-2">
                    Sizes
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSize}
                            onChange={handleSizeChange}
                            placeholder="Enter size (e.g., S, M, L, XL)"
                            className="flex-1 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        />
                        <button
                            type="button"
                            onClick={addSize}
                            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </label>

                {/* Display added sizes */}
                {productInfo.sizes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {productInfo.sizes.map((size, index) => (
                            <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                <span>{size}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSize(size)}
                                    className="ml-2 text-blue-800 hover:text-blue-900 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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