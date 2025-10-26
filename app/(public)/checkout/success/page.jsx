'use client'
import { CheckCircleIcon, PackageIcon, TruckIcon } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Order Placed Successfully!</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been received and is being processed. 
            You will receive an email confirmation shortly.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <PackageIcon size={24} className="text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Order #12345</p>
                <p className="text-sm text-slate-600">Placed on October 26, 2025</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <TruckIcon size={24} className="text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Estimated Delivery</p>
                <p className="text-sm text-slate-600">October 30, 2025</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/orders" 
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Order Status
            </Link>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}