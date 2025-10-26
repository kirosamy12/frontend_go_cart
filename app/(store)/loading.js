'use client'
import ModernStoreLayout from "@/components/ModernStoreLayout"
import ModernLoading from "@/components/ModernLoading"

export default function StoreLoadingPage() {
  return (
    <ModernStoreLayout>
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md mx-auto">
          <ModernLoading />
        </div>
      </div>
    </ModernStoreLayout>
  )
}