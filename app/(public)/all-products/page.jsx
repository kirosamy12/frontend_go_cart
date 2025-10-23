'use client'
import { Suspense, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "@/lib/features/product/productSlice"

function AllProductsContent() {
    const dispatch = useDispatch()

    const products = useSelector(state => state.product.list)
    const loading = useSelector(state => state.product.loading)
    const error = useSelector(state => state.product.error)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    if (loading) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <p className="text-slate-500">Loading products...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 className="text-2xl text-slate-500 my-6">
                    All <span className="text-slate-700 font-medium">Products</span>
                </h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 justify-start mb-32">
                    {products.length > 0 ? (
                        products
                            .filter(product => product?.createdAt) // Only include products with createdAt
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                            .map((product) => <ProductCard key={product.id || product._id || Math.random()} product={product} />)
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500">No products found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function AllProducts() {
    return (
        <Suspense fallback={<div>Loading all products...</div>}>
            <AllProductsContent />
        </Suspense>
    )
}
