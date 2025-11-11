'use client'
import ModernLoading from "@/components/ModernLoading"
import { useEffect, useState } from "react"

export default function AdminUsers() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('https://go-cart-1bwm.vercel.app/api/admin/users', {
                headers: {
                    'token': token
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

    const toggleIsActive = async (userId) => {
        // Logic to toggle the status of a user
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/admin/users/${userId}/toggle`, {
                method: 'PUT',
                headers: {
                    'token': token
                }
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Update local state
                    setUsers(prev => prev.map(user =>
                        user.id === userId ? { ...user, isActive: !user.isActive } : user
                    ))
                }
            }
        } catch (error) {
            console.error('Error toggling user status:', error)
        }
    }

    const updateUserRole = async (userId, newRole) => {
        // Logic to update user role
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`https://go-cart-1bwm.vercel.app/api/updateUserRole/${userId}`, {
                method: 'PUT',
                headers: {
                    'token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Update local state
                    setUsers(prev => prev.map(user =>
                        user.id === userId ? { ...user, role: newRole } : user
                    ))
                    alert('User role updated successfully')
                } else {
                    alert(data.message || 'Failed to update user role')
                }
            } else {
                alert('Failed to update user role')
            }
        } catch (error) {
            console.error('Error updating user role:', error)
            alert('Error updating user role')
        }
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
                            <div className="flex-1 flex items-center gap-4">
                                <div className="bg-slate-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 capitalize">{user.name}</h2>
                                    <p className="text-slate-600">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">Role:</span>
                                    <select 
                                        value={user.role || 'user'}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                        className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                                    >
                                        <option value="user">User</option>
                                        <option value="store">Store</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">Active:</span>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toggleIsActive(user.id)} checked={user.isActive} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No users Available</h1>
                </div>
            )
            }
        </div>
    ) : <ModernLoading />
}