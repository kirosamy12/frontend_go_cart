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

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/order/${orderId}`, {
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

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/${orderId}/tracking`, {
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
            return rejectWithValue(error.message)
        }
    }
)

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        storeOrders: [],
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
    }
})

export default ordersSlice.reducer
