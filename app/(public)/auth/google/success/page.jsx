'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, UserIcon } from "lucide-react"
import Link from "next/link"

export default function GoogleSignupSuccess() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        // If user is not authenticated, redirect to signup
        if (!isAuthenticated) {
            router.push('/signup')
        }
    }, [isAuthenticated, router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircleIcon size={48} className="text-green-600" />
                    </div>
                    
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Welcome to ShopVerse!</h1>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Your Google account has been successfully connected. You're now part of our shopping community!
                    </p>
                    
                    <div className="bg-slate-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <UserIcon size={24} className="text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-slate-800">{user?.name || 'User'}</p>
                                <p className="text-sm text-slate-600">{user?.email || 'email@example.com'}</p>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">
                                Account created successfully on {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/" 
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Start Shopping
                        </Link>
                        <Link 
                            href="/profile" 
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}