'use client'
import ModernProductDetails from "@/components/ModernProductDetails";
import ProductDescription from "@/components/ProductDescription";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "@/lib/features/product/productSlice";
import Link from "next/link";

export default function Product() {

    const { productId } = useParams();
    const dispatch = useDispatch();
    const { currentProduct: product, loading } = useSelector(state => state.product);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProduct(productId));
        }
        scrollTo(0, 0)
    }, [productId, dispatch]);

    // Prevent hydration mismatch by not rendering until client-side
    if (typeof window === 'undefined') {
        return <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">Loading...</div>;
    }

    if (loading) {
        return <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">Loading...</div>;
    }

    if (!product) {
        return <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">Product not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="text-gray-600 text-sm mt-6 mb-4 px-4 sm:px-6">
                <Link href="/" className="text-indigo-600 hover:underline">Home</Link> / 
                <Link href="/shop" className="text-indigo-600 hover:underline"> Products</Link> / 
                <span> {product?.category?.name || 'Category'}</span>
            </div>

            {/* Product Details */}
            <ModernProductDetails product={product} />

            {/* Description & Reviews */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <ProductDescription product={product} />
            </div>
        </div>
    );
}