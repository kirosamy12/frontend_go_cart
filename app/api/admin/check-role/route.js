import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth' // Assuming you have a token verification function

export async function GET(request) {
    try {
        // Check authentication - you might use JWT or session-based auth
        // For now, we'll assume the token is passed in headers or cookies
        const authHeader = request.headers.get('authorization')
        const cookies = request.cookies

        // Check for token in header or cookie
        let token = null
        if (authHeader) {
            token = authHeader
        } else if (request.headers.get('token')) {
            token = request.headers.get('token')
        } else if (cookies.get('token')) {
            token = cookies.get('token').value
        }

        if (!token) {
            return NextResponse.json(
                { isAdmin: false, error: 'No token provided' },
                { status: 401 }
            )
        }

        // Decode token to get user role
        try {
            const parts = token.split('.')
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]))
                const userRole = payload.role

                const isAdmin = userRole === 'admin'

                return NextResponse.json({ isAdmin })
            } else {
                return NextResponse.json(
                    { isAdmin: false, error: 'Invalid token format' },
                    { status: 401 }
                )
            }
        } catch (decodeError) {
            console.error('Error decoding token:', decodeError)
            return NextResponse.json(
                { isAdmin: false, error: 'Invalid token' },
                { status: 401 }
            )
        }

    } catch (error) {
        console.error('Error checking admin role:', error)
        return NextResponse.json(
            { isAdmin: false, error: 'Failed to check admin role' },
            { status: 500 }
        )
    }
}
