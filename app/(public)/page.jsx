import Hero from "@/components/Hero"
import StoresSection from "@/components/StoresSection"
import CategoriesSection from "@/components/CategoriesSection"
import LatestProducts from "@/components/LatestProducts"
import BestSelling from "@/components/BestSelling"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <>
      <Hero />
      <StoresSection />
      <CategoriesSection />
      <LatestProducts />
      <BestSelling />
      <Newsletter />
    </>
  )
}
