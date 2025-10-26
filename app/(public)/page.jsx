import ModernHero from "@/components/ModernHero"
import ModernStoresSection from "@/components/ModernStoresSection"
import ModernAllProductsSection from "@/components/ModernAllProductsSection"
import CategoryCarousel from "@/components/CategoryCarousel"
import ModernLatestProducts from "@/components/ModernLatestProducts"
import ModernBestSelling from "@/components/ModernBestSelling"
import ModernNewsletter from "@/components/ModernNewsletter"
import ModernFooter from "@/components/ModernFooter"
import { assets } from "@/assets/assets"

export default function ModernHomePage() {
  return (
    <div className="bg-white">
      <ModernHero />
      
      {/* Brand showcase section */}
      <div className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Trusted by Leading Brands</h2>
            <p className="text-slate-600">Discover products from the world's most innovative companies</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="opacity-60 hover:opacity-100 transition-opacity">
                <div className="bg-slate-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ModernStoresSection />
      <CategoryCarousel />
      <ModernAllProductsSection />
      <ModernLatestProducts />
      <ModernBestSelling />
      <ModernNewsletter />
      <ModernFooter />
    </div>
  )
}