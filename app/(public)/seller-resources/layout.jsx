import Banner from "@/components/Banner"
import ModernNavbar from "@/components/ModernNavbar"

export const metadata = {
  title: "Seller Resources - ShopVerse",
  description: "Everything you need to start, grow, and succeed with your ShopVerse store",
}

export default function SellerResourcesLayout({ children }) {
  return (
    <main>{children}</main>
  )
}