'use client'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/lib/features/auth/authSlice'
import toast from 'react-hot-toast'

export default function ProfileForm({ user: initialUser, token }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: ''
    })
    const [updating, setUpdating] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (initialUser) {
            setFormData({
                name: initialUser.name || '',
                email: initialUser.email || '',
                image: initialUser.image || ''
            })
        }
    }, [initialUser])

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setUpdating(true)
        try {
            // Update user in Redux store
            const updatedUser = { ...initialUser, ...formData }
            dispatch(setUser(updatedUser))
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser))
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error('Error updating profile')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="max-w-md mx-auto flex flex-col gap-4 text-slate-500">
            <h2 className="text-2xl font-semibold text-slate-800">Edit Profile</h2>

            <div>
                <label className="block mb-1">Name</label>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={onChangeHandler}
                    placeholder="Enter your name"
                    className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    placeholder="Enter your email"
                    className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Profile Image URL</label>
                <input
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={onChangeHandler}
                    placeholder="Enter image URL"
                    className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                />
            </div>

            <button
                type="submit"
                disabled={updating}
                className="bg-slate-800 text-white px-8 py-2 rounded mt-4 hover:bg-slate-900 transition disabled:opacity-50"
            >
                {updating ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    )
}
