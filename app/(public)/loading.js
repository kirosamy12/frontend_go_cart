'use client'
import ModernNavbar from "@/components/ModernNavbar"
import ModernLoading from "@/components/ModernLoading"

export default function LoadingPage() {
  return (
    <>
      <ModernNavbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-2xl w-full px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
            <ModernLoading />
            
            {/* Additional Content */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">Browse Products</h4>
                <p className="text-sm text-slate-600">Discover amazing items</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">Top Stores</h4>
                <p className="text-sm text-slate-600">Find trusted sellers</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">Fast Delivery</h4>
                <p className="text-sm text-slate-600">Get it quickly</p>
              </div>
            </div>
            
            {/* Fun Fact */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-slate-600 italic">
                "Did you know? ShopVerse users save an average of 30% on their shopping compared to traditional stores."
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}