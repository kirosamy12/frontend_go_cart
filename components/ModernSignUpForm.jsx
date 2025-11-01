'use client'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator"

export default function ModernSignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const router = useRouter()

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        
        try {
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Account created successfully! Welcome to ShopVerse!")
                dispatch(login({ user: data.user, token: data.token }))
                router.push('/')
            } else {
                toast.error(data.message || "Sign up failed! Please try again.")
            }
        } catch (error) {
            toast.error("An error occurred during sign up. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <User className="text-indigo-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                <p className="text-slate-600 mt-2">Join ShopVerse today</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={onChangeHandler}
                            placeholder="John Doe"
                            className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition`}
                            required
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={onChangeHandler}
                            placeholder="you@example.com"
                            className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition`}
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={onChangeHandler}
                            placeholder="••••••••"
                            className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    <PasswordStrengthIndicator password={formData.password} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={onChangeHandler}
                            placeholder="••••••••"
                            className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                        required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                        I agree to the <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
                    </label>
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
                            Creating account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>

            {/* Google Sign-Up Button */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => window.location.href = 'https://go-cart-1bwm.vercel.app/api/auth/google'}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign up with Google
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">
                            Already have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link 
                        href="/signin" 
                        className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in to ShopVerse
                    </Link>
                </div>
            </div>
        </div>
    )
}