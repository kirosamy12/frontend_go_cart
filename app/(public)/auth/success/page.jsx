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
        const token = searchParams.get('token')
        
        if (token) {
            // Save token to localStorage
            localStorage.setItem('token', token)
            
            // Set credentials in Redux store
            dispatch(setCredentials({ token }))
            
            // Show success message
            toast.success('Authentication successful!')
            
            // Redirect to home page
            router.push('/')
        } else {
            // If no token, redirect to signin
            router.push('/signin')
        }
        
        // Set loading to false after a short delay to ensure smooth transition
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)
        
        return () => clearTimeout(timer)
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