import { addressDummyData } from '@/assets/assets'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUserAddresses = createAsyncThunk(
    'address/getUserAddresses',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/address/getUserAddresses', {
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
            if (!data.success) throw new Error(data.message || 'Failed to get addresses')
            return data.addresses
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createAddress = createAsyncThunk(
    'address/createAddress',
    async (addressData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/v1/createAddress', {
                method: 'POST',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...addressData, userId: auth.user?.id || auth.user?.userId }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to create address')
            return data.address
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserAddresses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserAddresses.fulfilled, (state, action) => {
                state.loading = false
                // Set the fetched addresses
                if (action.payload) {
                    state.list = action.payload
                }
            })
            .addCase(getUserAddresses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createAddress.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false
                // Add the created address to the list
                if (action.payload) {
                    state.list.push(action.payload)
                }
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer