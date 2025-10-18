'use client'
import { Suspense, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, fetchProductsByCategorySlug } from "@/lib/features/product/productSlice"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const categoryParam = searchParams.get('category')
    const router = useRouter()
    const dispatch = useDispatch()

    const products = useSelector(state => state.product.list)
    const categoryProducts = useSelector(state => state.product.categoryProducts)
    const loading = useSelector(state => state.product.loading)
    const error = useSelector(state => state.product.error)

    // Determine which products to use
    let baseProducts = categoryParam ? categoryProducts : products

    // Apply search filter
    const filteredProducts = search
        ? baseProducts.filter(product =>
            product?.name?.toLowerCase().includes(search.toLowerCase())
        )
        : baseProducts;

    useEffect(() => {
        if (categoryParam) {
            dispatch(fetchProductsByCategorySlug(categoryParam))
        } else {
            dispatch(fetchProducts())
        }
    }, [dispatch, categoryParam])

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
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer">
                    {search && <MoveLeftIcon size={20} />}
                    {categoryParam ? `Category: ${categoryParam}` : 'All'} <span className="text-slate-700 font-medium">Products</span>
                </h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => <ProductCard key={product.id || product._id} product={product} />)
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


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
