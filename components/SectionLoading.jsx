'use client'
import { PackageIcon } from "lucide-react"

const SectionLoading = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <PackageIcon size={24} className="text-indigo-500" />
        </div>
      </div>
      
      <p className="text-slate-600 text-center">{message}</p>
    </div>
  )
}

export default SectionLoading