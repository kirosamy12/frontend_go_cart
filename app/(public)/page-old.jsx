import ModernHero from "@/components/ModernHero"
import ModernStoresSection from "@/components/ModernStoresSection"
import ModernAllProductsSection from "@/components/ModernAllProductsSection"
import CategoryCarousel from "@/components/CategoryCarousel"
import ModernLatestProducts from "@/components/ModernLatestProducts"
import ModernBestSelling from "@/components/ModernBestSelling"
import ModernNewsletter from "@/components/ModernNewsletter"
import ModernFooter from "@/components/ModernFooter"

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <ModernStoresSection />
      <CategoryCarousel />
      <ModernAllProductsSection />
      <ModernLatestProducts />
      <ModernBestSelling />
      <ModernNewsletter />
      <ModernFooter />
    </>
  )
}