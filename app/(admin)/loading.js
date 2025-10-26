'use client'
import AdminNavbar from "@/components/admin/AdminNavbar"
import ModernLoading from "@/components/ModernLoading"

export default function AdminLoadingPage() {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md mx-auto">
          <ModernLoading />
        </div>
      </div>
    </>
  )
}