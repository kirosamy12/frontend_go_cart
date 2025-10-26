'use client'
import ModernNavbar from "@/components/ModernNavbar"
import SectionLoading from "@/components/SectionLoading"

export default function OrdersLoadingPage() {
  return (
    <>
      <ModernNavbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <SectionLoading message="Loading your orders..." />
        </div>
      </div>
    </>
  )
}