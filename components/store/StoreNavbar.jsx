'use client'
import Link from "next/link"
import { useSelector } from "react-redux"
import ThemeToggle from "@/components/ThemeToggle"
import { StoreIcon } from "lucide-react"

const StoreNavbar = () => {

    const { user } = useSelector(state => state.auth)

    return (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
            <Link href="/store" className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <StoreIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Store Dashboard</h1>
                    <p className="text-xs text-slate-500">Welcome back, {user?.name || 'Store Owner'}</p>
                </div>
            </Link>
            <div className="flex items-center gap-4">
                <ThemeToggle />
            </div>
        </div>
    )
}

export default StoreNavbar