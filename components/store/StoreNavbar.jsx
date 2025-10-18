

'use client'
import Link from "next/link"
import { useSelector } from "react-redux"
import ThemeToggle from "@/components/ThemeToggle"

const StoreNavbar = () => {

    const { user } = useSelector(state => state.auth)

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 dark:border-slate-700 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-green-600 dark:text-green-400">go</span>cart<span className="text-green-600 dark:text-green-400 text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500 dark:bg-green-600">
                    Store
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <p className="text-slate-700 dark:text-slate-300">Hi, {user?.name || 'Seller'}</p>
            </div>
        </div>
    )
}

export default StoreNavbar
