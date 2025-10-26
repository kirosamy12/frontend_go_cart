'use client'
import ModernSignUpForm from "@/components/ModernSignUpForm"
import Link from "next/link"

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-800">
                        <span className="text-indigo-600">shop</span>verse<span className="text-indigo-600">.</span>
                    </Link>
                </div>
                <ModernSignUpForm />
                <div className="mt-6 text-center text-sm text-slate-600">
                    By signing up, you agree to our <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    )
}