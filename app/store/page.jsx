'use client'
import ModernStoreDashboard from "@/components/ModernStoreDashboard"
import ModernLoading from "@/components/ModernLoading"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, user, token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and has store role
    if (!isAuthenticated || user?.role !== 'store') {
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
    <ModernStoreDashboard />
  )
}