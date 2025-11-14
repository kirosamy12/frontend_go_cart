'use client'
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import AdminNavbar from "@/components/admin/AdminNavbar"
import AdminSidebar from "@/components/admin/AdminSidebar"
import ModernLoading from "@/components/ModernLoading"

const AdminLayoutOld = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, user, token } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is authenticated and has admin role
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/signin')
        } else {
            setLoading(false)
        }
    }, [isAuthenticated, user, router])

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ModernLoading />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayoutOld