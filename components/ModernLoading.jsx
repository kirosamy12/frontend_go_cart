'use client'
import { PackageIcon, ShoppingCartIcon, StoreIcon } from "lucide-react"

const ModernLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        
        {/* Animated Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse">
            <PackageIcon size={32} className="text-indigo-500" />
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Loading ShopVerse</h3>
        <p className="text-slate-600">Preparing your shopping experience...</p>
      </div>
      
      {/* Progress Indicators */}
      <div className="flex gap-1 mt-6">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-indigo-200 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default ModernLoading