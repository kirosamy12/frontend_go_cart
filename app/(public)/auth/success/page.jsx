'use client'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import ModernLoading from "@/components/ModernLoading"
import { setCredentials } from "@/lib/features/auth/authSlice"
import toast from "react-hot-toast"

export default function AuthSuccess() {
    const router = useRouter()
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!searchParams) return;

        const token = searchParams.get('token')

        if (!token) {
            router.push('/signin')
            return
        }

        try {
            // Save token to localStorage
            localStorage.setItem('token', token)

            // Update Redux
            dispatch(setCredentials({ token }))

            // Notify the user
            toast.success('Authentication successful!')

            // Redirect to home
            router.push('/')
        } catch (error) {
            console.error("AuthSuccess error:", error)
            toast.error("Failed to handle authentication")
            router.push('/signin')
        }

        setLoading(false)

    }, [searchParams, dispatch, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <ModernLoading />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Successful</h1>
                <p className="text-gray-600">You will be redirected shortly...</p>
            </div>
        </div>
    )
}
