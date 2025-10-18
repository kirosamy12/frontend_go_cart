'use client'

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Loading from "@/components/Loading"

export default function LoadingPage() {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loading />
          <h2 className="mt-4 text-xl font-semibold text-slate-700">Loading GoCart...</h2>
          <p className="mt-2 text-slate-500">Please wait while we prepare your experience.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
