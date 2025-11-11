'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import {
  BarChart3Icon,
  StoreIcon,
  UsersIcon,
  PackageIcon,
  ShoppingBasketIcon,
  TrendingUpIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  HomeIcon
} from "lucide-react"

export default function DashboardLayout({ children, activePage = 'dashboard' }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: BarChart3Icon, href: '/admin', key: 'dashboard' },
    { name: 'Stores', icon: StoreIcon, href: '/admin/stores', key: 'stores' },
    { name: 'Users', icon: UsersIcon, href: '/admin/users', key: 'users' },
    { name: 'Orders', icon: PackageIcon, href: '/admin/orders', key: 'orders' },
    { name: 'Products', icon: ShoppingBasketIcon, href: '/admin/products', key: 'products' },
    { name: 'Categories', icon: ShoppingCartIcon, href: '/admin/categories', key: 'categories' },
    { name: 'Coupons', icon: TrendingUpIcon, href: '/admin/coupons', key: 'coupons' },
    { name: 'Approve', icon: UserCircleIcon, href: '/admin/approve', key: 'approve' },
  ]

  const handleLogout = () => {
    // Dispatch logout action
    dispatch({ type: 'auth/logout' })
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <BarChart3Icon className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">GoCart Admin</span>
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon size={24} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.key
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOutIcon size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="mr-4 text-gray-500 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">{activePage}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                <HomeIcon size={18} />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="text-indigo-600" size={20} />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}