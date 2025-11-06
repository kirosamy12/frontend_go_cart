'use client'
import { useState } from "react"
import { Mail } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            // Make API call to send OTP
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("OTP sent to your email!")
                setIsSubmitted(true)
                // Redirect to OTP verification page
                setTimeout(() => {
                    router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
                }, 2000)
            } else {
                toast.error(data.message || "Failed to send OTP. Please try again.")
            }
        } catch (error) {
            console.error('Error sending OTP:', error)
            toast.error("Failed to send OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-800">
                        <span className="text-indigo-600">shop</span>verse<span className="text-indigo-600">.</span>
                    </Link>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Reset Your Password</h2>
                        <p className="text-slate-600 mt-2">
                            {isSubmitted 
                                ? "Check your email for OTP" 
                                : "Enter your email and we'll send you an OTP to reset your password"}
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <p className="text-slate-600 mb-6">
                                We've sent an OTP to <span className="font-medium">{email}</span>
                            </p>
                            <p className="text-sm text-slate-500 mb-6">
                                Redirecting to OTP verification page...
                            </p>
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/signin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
                
                <div className="mt-6 text-center text-sm text-slate-600">
                    By using ShopVerse, you agree to our <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    )
}