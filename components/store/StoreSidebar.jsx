'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon, TagIcon, SettingsIcon, PackageIcon, FolderPlusIcon, FolderIcon } from "lucide-react"
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
            title: 'Categories',
            items: [
                { name: 'Add Category', href: '/store/add-category', icon: FolderPlusIcon },
                { name: 'Manage Categories', href: '/store/manage-category', icon: FolderIcon }
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
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <Image className="w-14 h-14 rounded-full shadow-md" src={storeInfo?.logo} alt="" width={80} height={80} />
                <p className="text-slate-700">{storeInfo?.name}</p>
            </div>

            <div className="max-sm:mt-6">
                {sidebarSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0">
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-3 max-sm:hidden">{section.title}</p>
                        <div className="flex flex-col gap-1">
                            {section.items.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${
                                        pathname === link.href ? 'bg-slate-100 sm:text-slate-600 font-semibold' : ''
                                    }`}
                                >
                                    <link.icon size={18} className="sm:ml-5" />
                                    <p className="max-sm:hidden">{link.name}</p>
                                    {pathname === link.href && (
                                        <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>
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