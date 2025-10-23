'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "@/lib/features/product/productSlice";

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
        return <div className="mx-6 max-w-7xl mx-auto mt-8">Loading...</div>;
    }

    if (loading) {
        return <div className="mx-6 max-w-7xl mx-auto mt-8">Loading...</div>;
    }

    if (!product) {
        return <div className="mx-6 max-w-7xl mx-auto mt-8">Product not found</div>;
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category?.name || 'Category'}
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}
