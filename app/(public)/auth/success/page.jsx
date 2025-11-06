'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/features/auth/authSlice'
import Loading from '@/components/Loading'

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

export default function AuthSuccess() {
    const router = useRouter()
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const { isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        const handleAuthSuccess = () => {
            try {
                // Get the token from URL parameters
                const token = searchParams.get('token')
                
                // If no token, redirect to sign in
                if (!token) {
                    router.push('/signin?error=invalid_token')
                    return
                }
                
                // Decode token to get user data
                const decodedToken = decodeToken(token)
                console.log("Auth Success - Decoded Token:", decodedToken);

                if (decodedToken) {
                    // Extract storeId from various possible locations
                    const storeId = decodedToken.storeId || 
                                   decodedToken.store?.id || 
                                   decodedToken.store?._id || 
                                   decodedToken.store ||
                                   null;
                    
                    console.log("Auth Success - Extracted storeId:", storeId);
                    
                    // Create user object from token data
                    const userFromToken = {
                        id: decodedToken.id || decodedToken.userId,
                        name: decodedToken.name,
                        email: decodedToken.email,
                        role: decodedToken.role || 'user',
                        storeId: storeId,
                        ...decodedToken
                    }
                    
                    console.log("Auth Success - User object to save:", userFromToken);

                    // Dispatch the login action
                    dispatch(login({ user: userFromToken, token }))

                    // Redirect based on user role from token
                    if (decodedToken.role === 'admin') {
                        router.push('/admin')
                    } else if (decodedToken.role === 'store') {
                        router.push('/store')
                    } else {
                        // For regular users, redirect to home page
                        router.push('/')
                    }
                } else {
                    router.push('/signin?error=token_decode_failed')
                }
            } catch (error) {
                console.error('Auth success error:', error)
                router.push('/signin?error=server_error')
            }
        }

        // Only process if not already authenticated
        if (!isAuthenticated) {
            handleAuthSuccess()
        } else {
            // If already authenticated, redirect to home
            router.push('/')
        }
    }, [router, searchParams, dispatch, isAuthenticated])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-center">
                <Loading />
                <p className="mt-4 text-slate-600">Completing authentication...</p>
            </div>
        </div>
    )
}