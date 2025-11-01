'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function GoogleAuthError() {
    const router = useRouter()

    useEffect(() => {
        // Auto-redirect to sign-in page after 5 seconds
        const timer = setTimeout(() => {
            router.push('/signin')
        }, 5000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Failed</h2>
                <p className="text-slate-600 mb-6">
                    We couldn't complete your Google authentication. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                        href="/signin" 
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link 
                        href="/" 
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
                <p className="text-slate-500 text-sm mt-6">
                    You'll be automatically redirected to the sign-in page in 5 seconds.
                </p>
            </div>
        </div>
    )
}