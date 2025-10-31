import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
}

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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        setToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem('token', action.payload)
        },
        checkAuthStatus: (state) => {
            const token = localStorage.getItem('token')

            if (token) {
                try {
                    // Decode token to get user data
                    const decodedToken = decodeToken(token)
                    console.log("checkAuthStatus - Decoded Token:", decodedToken);

                    if (decodedToken && !isTokenExpired(token)) {
                        // Extract storeId from various possible locations
                        const storeId = decodedToken.storeId || 
                                       decodedToken.store?.id || 
                                       decodedToken.store?._id || 
                                       decodedToken.store ||
                                       null;
                        
                        console.log("checkAuthStatus - Extracted storeId:", storeId);
                        
                        // Create user object from token data
                        const userFromToken = {
                            id: decodedToken.id || decodedToken.userId,
                            name: decodedToken.name,
                            email: decodedToken.email,
                            role: decodedToken.role || 'user',
                            storeId: storeId,
                            ...decodedToken
                        }
                        
                        console.log("checkAuthStatus - User object:", userFromToken);

                        state.token = token
                        state.user = userFromToken
                        state.isAuthenticated = true

                        // Update localStorage with user data from token
                        localStorage.setItem('user', JSON.stringify(userFromToken))
                    } else {
                        // Token expired or invalid
                        state.user = null
                        state.token = null
                        state.isAuthenticated = false
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                    }
                } catch (error) {
                    console.error('Error checking auth status:', error)
                    state.user = null
                    state.token = null
                    state.isAuthenticated = false
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                }
            }
        },
        updateUserRole: (state, action) => {
            if (state.user) {
                state.user.role = action.payload
                localStorage.setItem('user', JSON.stringify(state.user))
            }
        },
    }
})

// Helper function to check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = decodeToken(token)
        if (!decoded || !decoded.exp) {
            return true
        }
        const currentTime = Date.now() / 1000
        return decoded.exp < currentTime
    } catch (error) {
        return true
    }
}

export const { login, logout, setUser, setToken, checkAuthStatus, updateUserRole } = authSlice.actions

export default authSlice.reducer
