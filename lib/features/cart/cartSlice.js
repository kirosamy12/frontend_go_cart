import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/myCart/my', {
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
            if (!data.success) throw new Error(data.message || 'Failed to get cart')
            return data.cart
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createCart = createAsyncThunk(
    'cart/createCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            // Send empty items array to create empty cart
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/createCart', {
                method: 'POST',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: [] }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to create cart')
            return data.cart
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addToCartAsync = createAsyncThunk(
    'cart/addToCartAsync',
    async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/addToCart', {
                method: 'PATCH',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to add to cart')
            return data.cart
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ productId, quantity }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/updateCart', {
                method: 'PATCH',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: [{ productId, quantity }] }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to update cart')
            return data.cart
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createOrder = createAsyncThunk(
    'cart/createOrder',
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/createOrder', {
                method: 'POST',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    addressId: orderData.addressId,
                    paymentMethod: orderData.paymentMethod
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to create order')
            return data.order
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false
                // Update cart state with fetched cart data
                if (action.payload) {
                    if (action.payload.items && Array.isArray(action.payload.items)) {
                        state.cartItems = action.payload.items
                            .filter(item => item.quantity > 0)
                            .reduce((acc, item) => {
                                acc[item.productId] = item.quantity;
                                return acc;
                            }, {});
                    } else {
                        state.cartItems = action.payload.items || {};
                    }
                    state.total = action.payload.total || Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0);
                }
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.loading = false
                // Update cart state with created cart data
                // Assuming the cart data has items as array of {productId, quantity} and total
                if (action.payload) {
                    if (action.payload.items && Array.isArray(action.payload.items)) {
                        state.cartItems = action.payload.items.reduce((acc, item) => {
                            acc[item.productId] = item.quantity;
                            return acc;
                        }, {});
                    } else {
                        state.cartItems = action.payload.items || {};
                    }
                    state.total = action.payload.total || Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0);
                }
            })
            .addCase(createCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addToCartAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false
                // Update cart state with added item data
                // Assuming the cart data has items as array of {productId, quantity} and total
                if (action.payload) {
                    if (action.payload.items && Array.isArray(action.payload.items)) {
                        state.cartItems = action.payload.items
                            .filter(item => item.quantity > 0) // Remove items with quantity 0
                            .reduce((acc, item) => {
                                acc[item.productId] = item.quantity;
                                return acc;
                            }, {});
                    } else {
                        state.cartItems = action.payload.items || {};
                    }
                    state.total = action.payload.total || Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0);
                }
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false
                // Update cart state with updated cart data
                // Assuming the cart data has items as array of {productId, quantity} and total
                if (action.payload) {
                    if (action.payload.items && Array.isArray(action.payload.items)) {
                        state.cartItems = action.payload.items
                            .filter(item => item.quantity > 0)
                            .reduce((acc, item) => {
                                acc[item.productId] = item.quantity;
                                return acc;
                            }, {});
                    } else {
                        state.cartItems = action.payload.items || {};
                    }
                    state.total = action.payload.total || Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0);
                }
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                // Clear cart after successful order creation
                state.cartItems = {}
                state.total = 0
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export { updateCart, getCart, createCart, addToCartAsync, createOrder }

export default cartSlice.reducer
