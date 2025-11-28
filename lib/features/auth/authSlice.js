
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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

// Add the createShop async thunk
export const createShop = createAsyncThunk(
    'auth/createShop',
    async ({ shopData, logo, token }, { rejectWithValue }) => {
        try {
            // Create FormData object to handle file uploads
            const formData = new FormData();
            
            // Append all shop data fields
            Object.keys(shopData).forEach(key => {
                formData.append(key, shopData[key]);
            });
            
            // Append logo file if provided
            if (logo) {
                formData.append('logo', logo);
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/createStore', {
                method: 'POST',
                headers: {
                    'token': token,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to create shop');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
        // New reducer for Google authentication
        googleLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createShop.fulfilled, (state, action) => {
                // Update user with store information after successful creation
                if (action.payload.shop) {
                    state.user = {
                        ...state.user,
                        storeId: action.payload.shop.id,
                        store: action.payload.shop
                    };
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            })
            .addCase(createShop.rejected, (state, action) => {
                // Handle error - you might want to show this in the UI
                console.error('Failed to create shop:', action.payload);
            });
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

export const { login, logout, setUser, setToken, checkAuthStatus, updateUserRole, googleLogin } = authSlice.actions

export default authSlice.reducer
