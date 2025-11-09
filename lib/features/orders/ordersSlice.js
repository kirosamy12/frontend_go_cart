import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUserOrders = createAsyncThunk(
    'orders/getUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/orders/getUserOrders', {
                method: 'GET',
                headers: {
                    'token': auth.token,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get orders')
            return data.orders
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const getStoreOrders = createAsyncThunk(
    'orders/getStoreOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/store/orders', {
                method: 'GET',
                headers: {
                    'token': auth.token,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get store orders')
            return data.orders
        } catch (error) {
            // Handle CORS errors specifically
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                console.error('CORS error or network issue:', error);
                return rejectWithValue('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support.');
            }
            return rejectWithValue(error.message)
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, status }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            console.log('Updating order status with:', { orderId, status });
            
            if (!orderId) {
                throw new Error('Order ID is required')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to update order status')
            return { orderId, status: data.order.status }
        } catch (error) {
            console.error('Error in updateOrderStatus:', error);
            // Handle CORS errors specifically
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                return rejectWithValue('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support.');
            }
            return rejectWithValue(error.message)
        }
    }
)

export const getOrderById = createAsyncThunk(
    'orders/getOrderById',
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/order/${orderId}`, {
                method: 'GET',
                headers: {
                    'token': auth.token,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get order')
            return data.order
        } catch (error) {
            // Handle CORS errors specifically
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                return rejectWithValue('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support.');
            }
            return rejectWithValue(error.message)
        }
    }
)

export const getOrderTracking = createAsyncThunk(
    'orders/getOrderTracking',
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/order/${orderId}/tracking`, {
                method: 'GET',
                headers: {
                    'token': auth.token,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to get order tracking')
            return data.tracking
        } catch (error) {
            // Handle CORS errors specifically
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                return rejectWithValue('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support.');
            }
            return rejectWithValue(error.message)
        }
    }
)

export const getStoreInvoices = createAsyncThunk(
    'orders/getStoreInvoices',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            // Log the request for debugging
            console.log('Fetching invoices with token:', auth.token ? 'Token present' : 'No token')

            // Add a timeout to the fetch request
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

            // Updated API endpoint
            const url = 'https://go-cart-1bwm.vercel.app/api/store/invoices'
            console.log('Fetching invoices from:', url)
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'token': auth.token,
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            console.log('Response status:', response.status)
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.log('Error response data:', errorData)
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('Success response data:', data)
            if (!data.success) throw new Error(data.message || 'Failed to get invoices')
            return data
        } catch (error) {
            console.error('Error in getStoreInvoices:', error);
            // Handle different types of errors
            if (error.name === 'AbortError') {
                return rejectWithValue('Request timeout. Please check your internet connection and try again.');
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                return rejectWithValue('Unable to connect to the server. Please check your internet connection and ensure the API server is running. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/invoices');
            } else if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                console.error('CORS error or network issue:', error);
                return rejectWithValue('Unable to connect to the server. This may be due to CORS restrictions or network issues. Please try again later or contact support. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/invoices');
            }
            return rejectWithValue(error.message)
        }
    }
)

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        storeOrders: [],
        storeInvoices: [],
        currentOrder: null,
        orderTracking: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.loading = false
                // Set the fetched orders
                if (action.payload) {
                    state.list = action.payload
                }
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getStoreOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getStoreOrders.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.storeOrders = action.payload
                }
            })
            .addCase(getStoreOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false
                // Update the order status in storeOrders
                if (action.payload) {
                    const { orderId, status } = action.payload
                    const orderIndex = state.storeOrders.findIndex(order => order.id === orderId || order._id === orderId)
                    if (orderIndex !== -1) {
                        state.storeOrders[orderIndex].status = status
                    }
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getOrderById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrder = action.payload
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getOrderTracking.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrderTracking.fulfilled, (state, action) => {
                state.loading = false
                state.orderTracking = action.payload
            })
            .addCase(getOrderTracking.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getStoreInvoices.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getStoreInvoices.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.storeInvoices = action.payload.invoices
                }
            })
            .addCase(getStoreInvoices.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default ordersSlice.reducer
