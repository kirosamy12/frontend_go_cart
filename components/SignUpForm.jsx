'use client'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function SignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const dispatch = useDispatch()
    const router = useRouter()

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }
        try {
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Sign up successful!")
                dispatch(login({ user: data.user, token: data.token }))
                router.push('/')
            } else {
                toast.error(data.message || "Sign up failed!")
            }
        } catch (error) {
            toast.error("An error occurred during sign up.")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="max-w-md mx-auto flex flex-col gap-4 text-slate-500">
            <h2 className="text-2xl font-semibold text-slate-800">Sign Up</h2>

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

            <div>
                <label className="block mb-1">Confirm Password</label>
                <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={onChangeHandler}
                    placeholder="Confirm your password"
                    className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                    required
                />
            </div>

            <button type="submit" className="bg-slate-800 text-white px-8 py-2 rounded mt-4 hover:bg-slate-900 transition">
                Sign Up
            </button>
        </form>
    )
}
