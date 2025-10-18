'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { updateProduct, fetchProduct } from "@/lib/features/product/productSlice"
import { fetchCategories } from "@/lib/features/category/categorySlice"
import { useParams, useRouter } from "next/navigation"

export default function StoreEditProduct() {
    const { productId } = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const { token, isAuthenticated } = useSelector(state => state.auth)
    const { currentProduct: product, loading: productLoading } = useSelector(state => state.product)
    const { list: categories, loading: categoriesLoading } = useSelector(state => state.category)

    const [images, setImages] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [replacedImages, setReplacedImages] = useState({})
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
        if (productId) {
            dispatch(fetchProduct(productId))
        }
        dispatch(fetchCategories())
    }, [dispatch, productId])

    useEffect(() => {
        if (product) {
            setProductInfo({
                name: product.name || "",
                description: product.description || "",
                mrp: product.mrp || 0,
                price: product.price || 0,
                category: product.category?.id || product.category || "",
                inStock: product.inStock ?? true,
            })
            setExistingImages(product.images || [])
        }
    }, [product])

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

    const removeExistingImage = (index) => {
        const newExistingImages = existingImages.filter((_, i) => i !== index)
        setExistingImages(newExistingImages)
    }

    const replaceExistingImage = (index) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = e.target.files[0]
            if (file) {
                const newReplacedImages = { ...replacedImages }
                newReplacedImages[index] = file
                setReplacedImages(newReplacedImages)
            }
        }
        input.click()
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Check if user is authenticated
            if (!isAuthenticated || !token) {
                toast.error("Please log in to update products")
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

            // Add existing images that haven't been replaced
            existingImages.forEach((image, index) => {
                if (!replacedImages[index]) {
                    formData.append('existingImages', image)
                }
            })

            // Add replaced images
            Object.entries(replacedImages).forEach(([index, file]) => {
                formData.append(`replacedImages[${index}]`, file)
            })

            // Add new images
            images.forEach(image => {
                formData.append('images', image)
            })

            const result = await dispatch(updateProduct({ id: productId, productData: formData })).unwrap()
            toast.success("Product updated successfully!")
            router.push('/store/manage-product')
        } catch (error) {
            console.error('Product update error:', error)

            // Handle specific error types
            if (error.includes('Authentication failed') || error.includes('No authentication token')) {
                toast.error("Authentication failed. Please log in again.")
            } else if (error.includes('Failed to update product')) {
                toast.error("Failed to update product. Please check your input and try again.")
            } else {
                toast.error(error || "Failed to update product. Please check your connection and try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    if (productLoading) {
        return <div className="text-center py-8">Loading product...</div>
    }

    if (!product) {
        return <div className="text-center py-8 text-red-500">Product not found</div>
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Edit <span className="text-slate-800 font-medium">Product</span></h1>
            <p className="mt-7">Product Images</p>
            <p className="text-sm text-slate-400 mb-2">Click on existing images to replace them, or use the upload area to add new images</p>

            <div className="flex gap-3 mt-4">
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative">
                        <Image
                            width={300}
                            height={300}
                            className='h-15 w-auto border border-slate-200 rounded cursor-pointer hover:border-blue-400 transition-colors'
                            src={replacedImages[index] ? URL.createObjectURL(replacedImages[index]) : image}
                            alt=""
                            onClick={() => replaceExistingImage(index)}
                            title="Click to replace image"
                        />
                        <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                        >
                            ×
                        </button>
                        {replacedImages[index] && (
                            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Replaced
                            </div>
                        )}
                    </div>
                ))}

                {/* New Images */}
                {images.map((image, index) => (
                    <div key={`new-${index}`} className="relative">
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

                {(existingImages.length + images.length) < 4 && (
                    <label htmlFor="images">
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
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
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
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span>In Stock</span>
            </label>

            <br />

            <button
                disabled={loading || !isAuthenticated || categoriesLoading}
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50"
            >
                {loading ? "Updating..." : "Update Product"}
            </button>

            {!isAuthenticated && (
                <p className="text-red-500 text-sm mt-2">Please log in to update products</p>
            )}
        </form>
    )
}
