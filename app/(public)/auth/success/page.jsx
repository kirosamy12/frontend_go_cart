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

        const token = searchParams.get("token")
        console.log("Received token:", token)

        if (!token) {
            toast.error("No token received")
            router.push("/signin")
            return
        }

        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", token)
            }

            dispatch(setCredentials({ token }))

            toast.success("Authentication successful!")

            setTimeout(() => {
                router.push("/")
            }, 300)

        } catch (err) {
            console.error("AuthSuccess error:", err)
            toast.error("Failed to handle authentication")
            router.push("/signin")
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
