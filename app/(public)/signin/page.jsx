'use client'
import ModernSignInForm from "@/components/ModernSignInForm"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignInPage() {
    const searchParams = useSearchParams()
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const error = searchParams.get('error')
        if (error) {
            switch (error) {
                case 'google_auth_failed':
                    setErrorMessage('Google authentication failed. Please try again.')
                    break
                case 'invalid_callback':
                    setErrorMessage('Invalid authentication callback. Please try again.')
                    break
                case 'token_decode_failed':
                    setErrorMessage('Failed to process authentication. Please try again.')
                    break
                case 'server_error':
                    setErrorMessage('Server error during authentication. Please try again later.')
                    break
                default:
                    setErrorMessage('An error occurred during authentication. Please try again.')
            }
            
            // Clear the error parameter from URL after displaying it
            const url = new URL(window.location)
            url.searchParams.delete('error')
            window.history.replaceState({}, '', url)
        }
    }, [searchParams])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-800">
                        <span className="text-indigo-600">shop</span>verse<span className="text-indigo-600">.</span>
                    </Link>
                </div>
                
                {/* Error message display */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700">{errorMessage}</p>
                        </div>
                    </div>
                )}
                
                <ModernSignInForm />
                <div className="mt-6 text-center text-sm text-slate-600">
                    By signing in, you agree to our <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    )
}