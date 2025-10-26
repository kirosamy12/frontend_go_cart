'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, Menu, X, StoreIcon } from "lucide-react"
import { useSelector } from "react-redux"
import ThemeToggle from "@/components/ThemeToggle"

const ModernStoreLayout = ({ children }) => {

    const { isAuthenticated, user } = useSelector(state => state.auth)
    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('dashboard')

    const fetchIsSeller = async () => {
        // Check if user is authenticated and has store role
        if (isAuthenticated && user?.role === 'store') {
            setIsSeller(true)
        } else {
            setIsSeller(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchIsSeller()
    }, [isAuthenticated, user])

    const sidebarSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', href: '/store', icon: StoreIcon }
            ]
        },
        {
            title: 'Products',
            items: [
                { name: 'Add Product', href: '/store/add-product', icon: StoreIcon },
                { name: 'Manage Products', href: '/store/manage-product', icon: StoreIcon }
            ]
        },
        {
            title: 'Orders',
            items: [
                { name: 'View Orders', href: '/store/orders', icon: StoreIcon }
            ]
        }
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (!isSeller) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-md">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                        <StoreIcon size={32} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Access Denied</h1>
                    <p className="text-slate-600 mb-8">Only store owners can access the store dashboard.</p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        Go to Home <ArrowRightIcon size={18} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        
                        <Link href="/store" className="flex items-center gap-2">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <StoreIcon size={20} className="text-indigo-600" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">Store Dashboard</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                                </span>
                            </div>
                            <span className="font-medium text-slate-700">{user?.name || 'Store Owner'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="flex flex-col h-full pt-6">
                        {/* Mobile header */}
                        <div className="px-4 pb-4 lg:hidden flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto px-4">
                            {sidebarSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-8">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3 px-3">
                                        {section.title}
                                    </p>
                                    <div className="space-y-1">
                                        {section.items.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.href}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false)
                                                    setActiveSection(link.name.toLowerCase())
                                                }}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                                    typeof window !== 'undefined' && window.location.pathname === link.href
                                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <link.icon size={18} />
                                                <span>{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Logout button */}
                        <div className="p-4 border-t border-slate-200">
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowRightIcon size={18} />
                                <span>Back to Store</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModernStoreLayout