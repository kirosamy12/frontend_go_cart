'use client'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) setEmail(emailParam)
    }, [searchParams])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP")
            return
        }
        
        setIsLoading(true)
        
        try {
            // Reset password with email, OTP, and new password
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    otp,
                    newPassword: password
                })
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("Password reset successfully!")
                // Redirect to sign in page
                setTimeout(() => {
                    router.push('/signin')
                }, 2000)
            } else {
                toast.error(data.message || "Failed to reset password. Please try again.")
            }
        } catch (error) {
            console.error('Error resetting password:', error)
            toast.error("Failed to reset password. Please try again.")
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
                            <Lock className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
                        <p className="text-slate-600 mt-2">
                            Enter your OTP and new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="block w-full px-3 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="Enter 4-digit OTP"
                                className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
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
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>

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