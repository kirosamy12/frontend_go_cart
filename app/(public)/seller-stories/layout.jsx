import Banner from "@/components/Banner"
import ModernNavbar from "@/components/ModernNavbar"

export const metadata = {
  title: "Seller Success Stories - ShopVerse",
  description: "Discover how entrepreneurs have built thriving businesses on ShopVerse",
}

export default function SellerStoriesLayout({ children }) {
  return (
    <main>{children}</main>
  )
}