'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { googleLogin } from '@/lib/features/auth/authSlice'
import ModernLoading from '@/components/ModernLoading'

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

export default function GoogleCallback() {
    const router = useRouter()
    const dispatch = useDispatch()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // Get the code from URL parameters
                const code = searchParams.get('code')
                const error = searchParams.get('error')
                
                // Check if there's an error from Google
                if (error) {
                    console.error('Google OAuth error:', error)
                    router.push('/signin?error=google_auth_failed')
                    return
                }
                
                // If no code, redirect to sign in
                if (!code) {
                    router.push('/signin?error=invalid_callback')
                    return
                }
                
                // Exchange the code for a token
                const response = await fetch('https://go-cart-1bwm.vercel.app/api/auth/google/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                })
                
                const data = await response.json()
                
                if (data.success && data.token) {
                    // Decode token to get user data
                    const decodedToken = decodeToken(data.token)
                    console.log("Google Auth - Decoded Token:", decodedToken);

                    if (decodedToken) {
                        // Extract storeId from various possible locations
                        const storeId = decodedToken.storeId || 
                                       decodedToken.store?.id || 
                                       decodedToken.store?._id || 
                                       decodedToken.store ||
                                       null;
                        
                        console.log("Google Auth - Extracted storeId:", storeId);
                        
                        // Create user object from token data
                        const userFromToken = {
                            id: decodedToken.id || decodedToken.userId,
                            name: decodedToken.name,
                            email: decodedToken.email,
                            role: decodedToken.role || 'user',
                            storeId: storeId,
                            ...decodedToken
                        }
                        
                        console.log("Google Auth - User object to save:", userFromToken);

                        // Dispatch the googleLogin action
                        dispatch(googleLogin({ user: userFromToken, token: data.token }))

                        // Redirect based on user role from token
                        if (decodedToken.role === 'admin') {
                            router.push('/admin')
                        } else if (decodedToken.role === 'store') {
                            router.push('/store')
                        } else {
                            // For regular users, redirect to home page after successful signup/login
                            router.push('/')
                        }
                    } else {
                        router.push('/signin?error=token_decode_failed')
                    }
                } else {
                    router.push(`/signin?error=${encodeURIComponent(data.message || 'google_auth_failed')}`)
                }
            } catch (error) {
                console.error('Google OAuth callback error:', error)
                // More detailed error handling
                if (error instanceof TypeError && error.message === 'Failed to fetch') {
                    router.push('/signin?error=network_error')
                } else {
                    router.push('/signin?error=server_error')
                }
            }
        }

        handleGoogleCallback()
    }, [router, searchParams, dispatch])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-center">
                <ModernLoading />
                <p className="mt-4 text-slate-600">Completing Google authentication...</p>
            </div>
        </div>
    )
}