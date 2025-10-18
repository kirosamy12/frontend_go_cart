'use client'
import PageTitle from "@/components/PageTitle";
import WishlistItem from "@/components/WishlistItem";
import { useSelector } from "react-redux";

export default function Wishlist() {

    const { wishlistItems } = useSelector(state => state.wishlist);
    const products = useSelector(state => state.product.list);

    const wishlistProducts = products.filter(product => wishlistItems.includes(product.id));

    return wishlistProducts.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="My Wishlist" text="items in your wishlist" linkText="Shop more" linkHref="/shop" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        wishlistProducts.map((product) => (
                            <WishlistItem key={product.id} product={product} />
                        ))
                    }
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your wishlist is empty</h1>
        </div>
    )
}
