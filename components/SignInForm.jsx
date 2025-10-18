'use client'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

// JWT token decoder utility
const decodeToken = (token) => {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Invalid token format')
        }
        const payload = parts[1]
        const decodedPayload = JSON.parse(atob(payload))
        return decodedPayload
    } catch (error) {
        console.error('Error decoding token:', error)
        return null
    }
}

export default function SignInForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const dispatch = useDispatch()
    const router = useRouter()

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Sign in successful!")

                // Decode token to get user data
                const decodedToken = decodeToken(data.token)

                if (decodedToken) {
                    // Create user object from token data
                    const userFromToken = {
                        id: decodedToken.id || decodedToken.userId,
                        name: decodedToken.name,
                        email: decodedToken.email,
                        role: decodedToken.role || 'user',
                        ...decodedToken
                    }

                    dispatch(login({ user: userFromToken, token: data.token }))

                    // Redirect based on user role from token
                    if (decodedToken.role === 'admin') {
                        router.push('/admin')
                    } else if (decodedToken.role === 'store') {
                        router.push('/store')
                    } else {
                        router.push('/')
                    }
                } else {
                    toast.error("Failed to decode authentication token!")
                }
            } else {
                toast.error(data.message || "Sign in failed!")
            }
        } catch (error) {
            console.error('Sign in error:', error)
            toast.error("An error occurred during sign in.")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="max-w-md mx-auto flex flex-col gap-4 text-slate-500">
            <h2 className="text-2xl font-semibold text-slate-800">Sign In</h2>

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
                <label className="block mb-1">Password</label>
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    placeholder="Enter your password"
                    className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                    required
                />
            </div>

            <button type="submit" className="bg-slate-800 text-white px-8 py-2 rounded mt-4 hover:bg-slate-900 transition">
                Sign In
            </button>
        </form>
    )
}
