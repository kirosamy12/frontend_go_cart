'use client'
import Loading from "@/components/Loading"

export default function GoogleCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-slate-600">Completing Google authentication...</p>
      </div>
    </div>
  )
}