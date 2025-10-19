'use client'
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import { UsersIcon, UserCheckIcon, UserXIcon, CrownIcon, EyeIcon } from "lucide-react"

export default function AdminUsers() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('https://go-cart-1bwm.vercel.app/api/admin/getAllUsers', {
                headers: {
                    'token': token ? `${token}` : '',
                    'Content-Type': 'application/json',
                }
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users || [])
            } else {
                setUsers([])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            setUsers([])
        }
        setLoading(false)
    }

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('token')
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/getUser/${userId}`, {
                method: 'PUT',
                headers: {
                    'token': token ? `${token}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    setUsers(prev => prev.map(user =>
                        user.id === userId ? { ...user, status: newStatus } : user
                    ))
                    return Promise.resolve()
                }
            }
            return Promise.reject()
        } catch (error) {
            console.error('Error toggling user status:', error)
            return Promise.reject()
        }
    }

    const updateUserRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/updateUserRole/${userId}`, {
                method: 'PATCH',
                headers: {
                    'token': token ? `${token}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    setUsers(prev => prev.map(user =>
                        user.id === userId ? { ...user, role: newRole } : user
                    ))
                    return Promise.resolve()
                }
            }
            return Promise.reject()
        } catch (error) {
            console.error('Error updating user role:', error)
            return Promise.reject()
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <CrownIcon size={16} className="text-yellow-500" />
            case 'store':
                return <UserCheckIcon size={16} className="text-green-500" />
            case 'store_owner':
                return <UserCheckIcon size={16} className="text-green-500" />
            default:
                return <UsersIcon size={16} className="text-blue-500" />
        }
    }

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Manage <span className="text-slate-800 font-medium">Users</span></h1>

            {users.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {users.map((user) => (
                        <div key={user.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-center max-w-4xl" >
                            {/* User Info */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-slate-800">{user.name}</h3>
                                    {getRoleIcon(user.role)}
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </div>
                                <p className="text-slate-600">@{user.username}</p>
                                <p className="text-slate-600">{user.email}</p>
                                <p className="text-slate-400 text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <div className="flex flex-col gap-2">
                                    <p>Status</p>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => toggleUserStatus(user.id, user.status)}
                                            checked={user.status === 'active'}
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Role</p>
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                        className="px-3 py-1 border border-slate-300 rounded-md text-sm"
                                    >
                                        <option value="user">User</option>
                                        <option value="store">Store Owner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No users found</h1>
                </div>
            )
            }
        </div>
    ) : <Loading />
}
