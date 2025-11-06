'use client'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState(["", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [resendTimer, setResendTimer] = useState(0)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    useEffect(() => {
        let timer
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [resendTimer])

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            
            // Auto focus to next input
            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`).focus()
            }
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData('text')
        const pasteDigits = paste.replace(/\D/g, '').split('').slice(0, 4)
        
        if (pasteDigits.length === 4) {
            setOtp(pasteDigits)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join('')
        
        if (otpCode.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP")
            return
        }
        
        setIsLoading(true)
        
        try {
            // Verify OTP
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/verifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpCode })
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("OTP verified successfully!")
                // Redirect to reset password page with email and OTP
                router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${otpCode}`)
            } else {
                toast.error(data.message || "Invalid OTP. Please try again.")
                // Clear OTP fields
                setOtp(["", "", "", ""])
                document.getElementById('otp-0').focus()
            }
        } catch (error) {
            console.error('Error verifying OTP:', error)
            toast.error("Failed to verify OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (resendTimer > 0) return
        
        try {
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("OTP resent successfully!")
                setResendTimer(60) // 60 seconds cooldown
                // Clear OTP fields
                setOtp(["", "", "", ""])
                document.getElementById('otp-0').focus()
            } else {
                toast.error(data.message || "Failed to resend OTP. Please try again.")
            }
        } catch (error) {
            console.error('Error resending OTP:', error)
            toast.error("Failed to resend OTP. Please try again.")
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
                        <h2 className="text-2xl font-bold text-slate-800">Verify OTP</h2>
                        <p className="text-slate-600 mt-2">
                            Enter the 4-digit code sent to <span className="font-medium">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Enter OTP</label>
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-14 h-14 text-2xl text-center border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || otp.some(d => d === "")}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Didn't receive the code?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={resendTimer > 0}
                                className={`font-medium ${resendTimer > 0 ? 'text-slate-400' : 'text-indigo-600 hover:text-indigo-500'}`}
                            >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                            </button>
                        </p>
                    </div>

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