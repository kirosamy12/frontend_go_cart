'use client'
import { Search, ShoppingCart, Heart, User, ChevronDown, LogOut, Settings, UserCircle, Package, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";

const ModernNavbar = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState('')
    const [isClient, setIsClient] = useState(false);
    
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.total)
    const { isAuthenticated, user } = useSelector(state => state.auth)

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
        setIsMobileMenuOpen(false)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
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

    // Don't render dynamic content on server
    if (!isClient) {
        return (
            <nav className="relative bg-white shadow-sm border-b border-slate-100">
                <div className="mx-4 sm:mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                        <div className="flex items-center gap-4">
                            {/* Mobile menu button */}
                            <button 
                                className="sm:hidden p-2 rounded-lg hover:bg-slate-100 opacity-0"
                            >
                                <Menu size={20} />
                            </button>

                            <Link href="/" className="relative text-3xl font-bold text-slate-800">
                                <span className="text-indigo-600">shop</span>verse<span className="text-indigo-600">.</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center gap-6 lg:gap-8 text-slate-600">
                            <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
                            <Link href="/shop" className="hover:text-indigo-600 transition-colors font-medium">Shop</Link>

                            <div className="hidden xl:flex items-center w-80 text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full opacity-0">
                                <Search size={18} className="text-slate-500" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-slate-500" 
                                    type="text" 
                                    placeholder="Search products..." 
                                />
                            </div>

                            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                <ShoppingCart size={20} />
                                <span className="font-medium">Cart</span>
                            </Link>

                            <Link href="/wishlist" className="relative flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                <Heart size={20} />
                                <span className="font-medium">Wishlist</span>
                            </Link>

                            <div className="flex gap-3">
                                <Link 
                                    href="/signin" 
                                    className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg text-center font-medium"
                                >
                                    Login
                                </Link>

                                <Link 
                                    href="/signup" 
                                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 transition text-white rounded-lg text-center font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="sm:hidden flex items-center gap-3">
                            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-slate-100">
                                <ShoppingCart size={20} className="text-slate-600" />
                            </Link>
                            
                            <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-slate-100">
                                <Heart size={20} className="text-slate-600" />
                            </Link>
                            
                            <Link href="/signin" className="p-2 rounded-lg hover:bg-slate-100">
                                <User size={20} className="text-slate-600" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="relative bg-white shadow-sm border-b border-slate-100">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button 
                            onClick={toggleMobileMenu}
                            className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <Link href="/" className="relative text-3xl font-bold text-slate-800">
                            <span className="text-indigo-600">shop</span>verse<span className="text-indigo-600">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-6 lg:gap-8 text-slate-600">
                        <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
                        <Link href="/shop" className="hover:text-indigo-600 transition-colors font-medium">Shop</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-80 text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full">
                            <Search size={18} className="text-slate-500" />
                            <input 
                                className="w-full bg-transparent outline-none placeholder-slate-500" 
                                type="text" 
                                placeholder="Search products..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                autoComplete="off"
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                            <ShoppingCart size={20} />
                            <span className="font-medium">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 left-3.5 text-[10px] text-white bg-indigo-500 size-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/wishlist" className="relative flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                            <Heart size={20} />
                            <span className="font-medium">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1.5 left-3.5 text-[10px] text-white bg-indigo-500 size-5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <User size={18} className="text-white" />
                                    </div>
                                    <span className="font-medium hidden lg:inline">{user?.name}</span>
                                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                            <p className="text-xs text-slate-500">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserCircle size={18} />
                                                My Account
                                            </Link>

                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={18} />
                                                My Orders
                                            </Link>

                                            {user?.role === 'store' && (
                                                <Link
                                                    href="/store"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={18} />
                                                    Store Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={18} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-slate-100 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link 
                                    href="/signin" 
                                    className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg text-center font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>

                                <Link 
                                    href="/signup" 
                                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 transition text-white rounded-lg text-center font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative p-2 rounded-lg hover:bg-slate-100">
                            <ShoppingCart size={20} className="text-slate-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[10px] text-white bg-indigo-500 size-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-slate-100">
                            <Heart size={20} className="text-slate-600" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[10px] text-white bg-indigo-500 size-5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        
                        {isAuthenticated ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 text-slate-600 p-2 rounded-lg hover:bg-slate-100"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                </button>

                                {/* Mobile Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserCircle size={16} />
                                                My Account
                                            </Link>

                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={16} />
                                                My Orders
                                            </Link>

                                            {user?.role === 'store' && (
                                                <Link
                                                    href="/store"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings size={16} />
                                                    Store Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
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
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/signin" className="p-2 rounded-lg hover:bg-slate-100">
                                <User size={20} className="text-slate-600" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40">
                    <div className="p-4">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={20} className="text-slate-500" />
                                <input 
                                    className="flex-1 bg-transparent outline-none placeholder-slate-500" 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                />
                            </div>
                        </form>
                        
                        <div className="flex flex-col gap-1">
                            <Link 
                                href="/" 
                                className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/shop" 
                                className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link 
                                href="/cart" 
                                className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Cart
                            </Link>
                            <Link 
                                href="/wishlist" 
                                className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Wishlist
                            </Link>
                            
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        href="/profile" 
                                        className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <Link 
                                        href="/orders" 
                                        className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    {user?.role === 'store' && (
                                        <Link 
                                            href="/store" 
                                            className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Store Dashboard
                                        </Link>
                                    )}
                                    {user?.role === 'admin' && (
                                        <Link 
                                            href="/admin" 
                                            className="py-3 px-4 hover:bg-slate-50 rounded-lg font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="py-3 px-4 text-left hover:bg-red-50 rounded-lg font-medium text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 pt-2">
                                    <Link 
                                        href="/signin" 
                                        className="py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-center font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href="/signup" 
                                        className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-center font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default ModernNavbar