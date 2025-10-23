'use client'
import { Search, ShoppingCart, Heart, User, ChevronDown, LogOut, Settings, UserCircle, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";

const Navbar = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.total)
    const { isAuthenticated, user } = useSelector(state => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
        setIsDropdownOpen(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <nav className="relative bg-white shadow-sm">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount || 0}</span>
                        </Link>

                        <Link href="/wishlist" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors">
                            <Heart size={18} />
                            Wishlist
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{wishlistCount || 0}</span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <span className="font-medium">{user?.name}</span>
                                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                            <p className="text-xs text-slate-500">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserCircle size={16} />
                                                My Account
                                            </Link>

                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={16} />
                                                My Orders
                                            </Link>

                                            {user?.role === 'store' && (
                                                <Link
                                                    href="/store"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={16} />
                                                    Store Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={16} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-slate-100 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/signin" className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-center">
                                    Login
                                </Link>

                                <Link href="/signup" className="px-6 py-2 bg-slate-800 hover:bg-slate-900 transition text-white rounded-full text-center">
                                    Sign Up
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex gap-2">
                        {isAuthenticated ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <User size={12} className="text-white" />
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Mobile Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserCircle size={14} />
                                                My Account
                                            </Link>

                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={14} />
                                                My Orders
                                            </Link>

                                            {user?.role === 'store' && (
                                                <Link
                                                    href="/store"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={14} />
                                                    Store Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={14} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-slate-100 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <LogOut size={14} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/signin" className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                    Login
                                </Link>
                                <Link href="/signup" className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-sm transition text-white rounded-full">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar
