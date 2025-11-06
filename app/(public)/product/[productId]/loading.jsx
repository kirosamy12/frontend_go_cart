'use client'
import SectionLoading from "@/components/SectionLoading"

export default function ProductLoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SectionLoading message="Loading product details..." />
      </div>
    </div>
  )
}
//g//