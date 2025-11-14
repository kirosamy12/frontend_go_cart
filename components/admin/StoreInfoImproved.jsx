'use client'
import Image from "next/image"
import { MapPin, Mail, Phone, Calendar, User, Store as StoreIcon, Package } from "lucide-react"

const StoreInfoImproved = ({ store, onClick }) => {
    return (
        <div 
          className={`flex flex-col h-full ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          onClick={onClick}
        >
            {/* Store header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                        {store.logo ? (
                            <Image 
                                width={64} 
                                height={64} 
                                src={store.logo} 
                                alt={store.name} 
                                className="rounded-xl object-cover w-full h-full"
                            />
                        ) : (
                            <StoreIcon className="text-gray-400" size={24} />
                        )}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {store.name}
                        </h3>
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                                store.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : store.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                            }`}
                        >
                            {store.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">@{store.username}</p>
                </div>
            </div>
            
            {/* Store description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {store.description || "No description provided"}
            </p>
            
            {/* Store details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{store.address || "No address provided"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2 flex-shrink-0" />
                    <span>{store.contact || "No contact provided"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{store.email || "No email provided"}</span>
                </div>
                {/* Orders count */}
                {store.ordersCount !== undefined && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Package size={16} className="mr-2 flex-shrink-0" />
                        <span>{store.ordersCount} Orders</span>
                    </div>
                )}
            </div>
            
            {/* User info */}
            <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center">
                                {store.user?.image ? (
                                    <Image 
                                        width={32} 
                                        height={32} 
                                        src={store.user.image} 
                                        alt={store.user.name || 'User'} 
                                        className="rounded-full object-cover w-full h-full"
                                    />
                                ) : (
                                    <User className="text-gray-400" size={16} />
                                )}
                            </div>
                        </div>
                        <div className="ml-2 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {store.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {store.user?.email || 'No email'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>
                            {store.createdAt 
                                ? new Date(store.createdAt).toLocaleDateString() 
                                : 'N/A'
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreInfoImproved