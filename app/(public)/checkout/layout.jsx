'use client'
import Banner from "@/components/Banner"
import ModernNavbar from "@/components/ModernNavbar"

export default function CheckoutLayout({ children }) {
  return (
    <>
      <Banner />
      <ModernNavbar />
      <main className="min-h-screen bg-slate-50">
        {children}
      </main>
    </>
  )
}