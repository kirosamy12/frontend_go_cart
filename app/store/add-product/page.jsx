'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { addProduct } from "@/lib/features/product/productSlice"
import { fetchCategories } from "@/lib/features/category/categorySlice"
import ColorPicker from "@/components/ColorPicker"
import ScentsPicker from "@/components/ScentsPicker"
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
        sizes: [],
        scents: [], // Add scents array
    })

    // New state for inventory management
    const [newSize, setNewSize] = useState("")
    const [sizeQuantities, setSizeQuantities] = useState({})
    const [colorSizeQuantities, setColorSizeQuantities] = useState({})
    const [loading, setLoading] = useState(false)
    const [imagePreviews, setImagePreviews] = useState([])
    const [uploadProgress, setUploadProgress] = useState(0)

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

    const addSize = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault()
        }
        
        const trimmedSize = newSize.trim().toUpperCase()
        if (trimmedSize && !productInfo.sizes.includes(trimmedSize)) {
            setProductInfo({
                ...productInfo,
                sizes: [...productInfo.sizes, trimmedSize]
            })
            // Initialize quantity for this size
            setSizeQuantities(prev => ({ ...prev, [trimmedSize]: 0 }))
            setNewSize("")
        }
    }

    const removeSize = (sizeToRemove) => {
        setProductInfo({
            ...productInfo,
            sizes: productInfo.sizes.filter(size => size !== sizeToRemove)
        })
        // Remove quantity for this size
        const newQuantities = { ...sizeQuantities }
        delete newQuantities[sizeToRemove]
        setSizeQuantities(newQuantities)
        
        // Remove this size from all color size quantities
        const newColorSizeQuantities = { ...colorSizeQuantities }
        Object.keys(newColorSizeQuantities).forEach(color => {
            const newSizeQuantities = { ...newColorSizeQuantities[color] }
            delete newSizeQuantities[sizeToRemove]
            newColorSizeQuantities[color] = newSizeQuantities
        })
        setColorSizeQuantities(newColorSizeQuantities)
    }

    const handleSizeQuantityChange = (size, value) => {
        setSizeQuantities(prev => ({
            ...prev,
            [size]: parseInt(value) || 0
        }))
    }

    const handleColorSizeQuantityChange = (color, size, value) => {
        setColorSizeQuantities(prev => ({
            ...prev,
            [color]: {
                ...prev[color],
                [size]: parseInt(value) || 0
            }
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && 
            (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp')
        )
        
        if (validFiles.length !== files.length) {
            toast.error("Please upload only JPG, JPEG, PNG, or WebP images")
            return
        }
        
        const largeFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024)
        if (largeFiles.length > 0) {
            toast.error("Image size should be less than 5MB")
            return
        }
        
        const previews = validFiles.map(file => URL.createObjectURL(file))
        
        setImages(prevImages => [...prevImages, ...validFiles])
        setImagePreviews(prevPreviews => [...prevPreviews, ...previews])
    }

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index])
        
        const newImages = [...images]
        const newPreviews = [...imagePreviews]
        
        newImages.splice(index, 1)
        newPreviews.splice(index, 1)
        
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setUploadProgress(0)

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

            if (!productInfo.name.trim()) {
                toast.error("Product name is required")
                setLoading(false)
                return
            }

            if (!productInfo.description.trim()) {
                toast.error("Product description is required")
                setLoading(false)
                return
            }

            if (!productInfo.category) {
                toast.error("Please select a category")
                setLoading(false)
                return
            }

            if (productInfo.price <= 0) {
                toast.error("Offer price must be greater than 0")
                setLoading(false)
                return
            }

            if (productInfo.mrp <= 0) {
                toast.error("Regular price must be greater than 0")
                setLoading(false)
                return
            }

            // Create FormData
            const formData = new FormData()
            formData.append('name', productInfo.name.trim())
            formData.append('description', productInfo.description.trim())
            formData.append('price', productInfo.price)
            formData.append('mrp', productInfo.mrp)
            formData.append('category', productInfo.category)
            formData.append('inStock', productInfo.inStock)
            
            // Append colors, sizes, and scents if they have values
            if (productInfo.colors.length > 0) {
                formData.append('colors', JSON.stringify(productInfo.colors))
            }
            if (productInfo.sizes.length > 0) {
                formData.append('sizes', JSON.stringify(productInfo.sizes))
                // Append size quantities
                formData.append('sizeQuantities', JSON.stringify(sizeQuantities))
                // Append color size quantities
                formData.append('colorSizeQuantities', JSON.stringify(colorSizeQuantities))
            }
            if (productInfo.scents.length > 0) {
                formData.append('scents', JSON.stringify(productInfo.scents))
            }

            // Append images
            images.forEach((image, index) => {
                formData.append('images', image)
            })

            // Dispatch action
            const result = await dispatch(addProduct({ productData: formData, token }))
            
            if (addProduct.fulfilled.match(result)) {
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
                    scents: [], // Reset scents
                })
                setSizeQuantities({})
                setColorSizeQuantities({})
                setImages([])
                setImagePreviews([])
                setNewSize("")
            } else {
                const errorMessage = result.payload || "Failed to add product. Please try again."
                toast.error(errorMessage)
                console.error("Product creation failed:", errorMessage)
            }

        } catch (error) {
            console.error("Error adding product:", error)
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
            setUploadProgress(0)
        }
    }

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
        }
    }, [imagePreviews])

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    // Find the selected category object
    const selectedCategory = categories.find(cat => cat.id === productInfo.category);
    const isCandleCategory = selectedCategory?.name?.toLowerCase().includes('candle') || 
                            selectedCategory?.name?.toLowerCase().includes('candles');

    if (categoriesLoading) {
        return <ModernLoading />
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5 w-full max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>

            <div className="flex flex-wrap gap-4 w-full">
                {/* Display all uploaded images */}
                {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={preview}
                            width={100}
                            height={100}
                            alt={`Product Image ${index + 1}`}
                            className="rounded-md object-cover border border-gray-300"
                            unoptimized={true}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            title="Remove image"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Upload button - always visible */}
                <label htmlFor="image-upload" className="cursor-pointer w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 transition-colors">
                    <div className="text-gray-400 text-2xl">+</div>
                    <div className="text-xs text-gray-500 mt-1">Add</div>
                    <input 
                        onChange={handleImageUpload} 
                        type="file" 
                        id="image-upload" 
                        hidden 
                        multiple 
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                </label>
                
                {/* Image count indicator */}
                {images.length > 0 && (
                    <div className="self-center text-sm text-gray-500">
                        {images.length} image{images.length !== 1 ? 's' : ''} selected
                    </div>
                )}
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
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" min="0.01" step="0.01" className="w-full max-w-45 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" min="0.01" step="0.01" rows={5} className="w-full max-w-45 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
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
                onChange={(colors) => {
                    setProductInfo({ ...productInfo, colors })
                    // Initialize color size quantities for new colors
                    const newColorSizeQuantities = { ...colorSizeQuantities }
                    colors.forEach(color => {
                        if (!newColorSizeQuantities[color]) {
                            newColorSizeQuantities[color] = {}
                            productInfo.sizes.forEach(size => {
                                newColorSizeQuantities[color][size] = 0
                            })
                        }
                    })
                    // Remove color size quantities for removed colors
                    Object.keys(newColorSizeQuantities).forEach(color => {
                        if (!colors.includes(color)) {
                            delete newColorSizeQuantities[color]
                        }
                    })
                    setColorSizeQuantities(newColorSizeQuantities)
                }}
            />

            {/* Scents Picker - Only show for candle categories */}
            {isCandleCategory && (
                <div className="my-6 w-full">
                    <ScentsPicker
                        scents={productInfo.scents}
                        onChange={(scents) => setProductInfo({ ...productInfo, scents })}
                    />
                </div>
            )}

            {/* Size Selection */}
            <div className="my-6 w-full">
                <label className="flex flex-col gap-2">
                    Sizes
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSize}
                            onChange={handleSizeChange}
                            placeholder="Enter size (e.g., S, M, L, XL)"
                            className="flex-1 p-3 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addSize()
                                }
                            }}
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

                {/* Display added sizes with quantities */}
                {productInfo.sizes.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">Size Quantities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {productInfo.sizes.map((size, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">{size}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sizeQuantities[size] || 0}
                                        onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display added sizes as tags */}
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

            {/* Color-Size Quantity Matrix */}
            {productInfo.colors.length > 0 && productInfo.sizes.length > 0 && (
                <div className="my-6 w-full">
                    <h3 className="font-medium text-gray-700 mb-3">Inventory by Color & Size</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border-b border-r border-gray-200 p-2 text-left">Color</th>
                                    {productInfo.sizes.map((size, index) => (
                                        <th key={index} className="border-b border-r border-gray-200 p-2 text-center">{size}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {productInfo.colors.map((color, colorIndex) => (
                                    <tr key={colorIndex}>
                                        <td className="border-b border-r border-gray-200 p-2">
                                            <div className="flex items-center">
                                                <div 
                                                    className="w-4 h-4 rounded-full border border-gray-300 mr-2" 
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                                <span>{color}</span>
                                            </div>
                                        </td>
                                        {productInfo.sizes.map((size, sizeIndex) => (
                                            <td key={sizeIndex} className="border-b border-r border-gray-200 p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={colorSizeQuantities[color]?.[size] || 0}
                                                    onChange={(e) => handleColorSizeQuantityChange(color, size, e.target.value)}
                                                    className="w-full p-1 text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <br />

            <button
                type="submit"
                disabled={loading || !isAuthenticated || categoriesLoading}
                className="bg-blue-600 text-white px-6 mt-7 py-3 hover:bg-blue-700 rounded-md transition disabled:opacity-50 flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Adding..."}
                    </>
                ) : (
                    "Add Product"
                )}
            </button>

            {!isAuthenticated && (
                <p className="text-red-500 text-sm mt-2">Please log in to add products</p>
            )}
            
            {/* Image upload tips */}
            <div className="text-xs text-gray-500 mt-2">
                Tip: You can select multiple images at once. Supported formats: JPG, PNG, WebP (max 5MB each)
            </div>
        </form>
    )
}