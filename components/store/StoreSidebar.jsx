'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon, TagIcon, SettingsIcon, PackageIcon, FolderPlusIcon, FolderIcon, StoreIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({storeInfo}) => {

    const pathname = usePathname()

    const sidebarSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', href: '/store', icon: HomeIcon }
            ]
        },
        {
            title: 'Products',
            items: [
                { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
                { name: 'Manage Products', href: '/store/manage-product', icon: PackageIcon }
            ]
        },

        {
            title: 'Orders',
            items: [
                { name: 'View Orders', href: '/store/orders', icon: LayoutListIcon }
            ]
        }
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60 bg-white">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <div className="relative">
                    <Image 
                        className="w-16 h-16 rounded-full shadow-md border-2 border-white" 
                        src={storeInfo?.logo || '/placeholder-image.jpg'} 
                        alt="" 
                        width={64} 
                        height={64} 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <StoreIcon size={12} className="text-white" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-slate-800 font-semibold">{storeInfo?.name || 'Store Name'}</p>
                    <p className="text-xs text-slate-500">Store Owner</p>
                </div>
            </div>

            <div className="max-sm:mt-6 px-3">
                {sidebarSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0">
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-3 max-sm:hidden">{section.title}</p>
                        <div className="flex flex-col gap-1">
                            {section.items.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`relative flex items-center gap-3 text-slate-600 hover:bg-slate-100 p-3 rounded-lg transition ${
                                        pathname === link.href ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
                                    }`}
                                >
                                    <link.icon size={18} />
                                    <p className="max-sm:hidden">{link.name}</p>
                                    {pathname === link.href && (
                                        <span className="absolute bg-indigo-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StoreSidebar