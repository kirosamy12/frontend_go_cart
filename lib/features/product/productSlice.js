import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Products should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/get/products', {
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to fetch products')
            return data.products
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchStoreProducts = createAsyncThunk(
    'product/fetchStoreProducts',
    async (storeId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            let endpoint;
            if (storeId) {
                endpoint = `https://go-cart-1bwm.vercel.app/api/store/${storeId}/products`
            } else {
                // Use token-based endpoint for current user's store products (for manage products)
                endpoint = 'https://go-cart-1bwm.vercel.app/api/my-store/products'
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
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
            if (!data.success) throw new Error(data.message || 'Failed to fetch store products')
            return data.products
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchStoreProductsByUsername = createAsyncThunk(
    'product/fetchStoreProductsByUsername',
    async (username, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Products should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/store/${username}/products`, {
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to fetch store products by username')
            return data.products
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchProduct = createAsyncThunk(
    'product/fetchProduct',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Products should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/get/products/${productId}`, {
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to fetch product')
            return data.product
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchProductsByCategory',
    async (categoryId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Products should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/category/${categoryId}`, {
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to fetch products by category')
            return data.products
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchProductsByCategorySlug = createAsyncThunk(
    'product/fetchProductsByCategorySlug',
    async (slug, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Products should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/products/${slug}`, {
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to fetch products by category slug')
            return data.products
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (productData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/createProduct', {
                method: 'POST',
                headers: {
                    'token': auth.token,
                },
                body: productData, // FormData for file uploads
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to add product')
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, productData }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'token': auth.token,
                },
                body: productData, // FormData for file uploads
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to update product')
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/deleteProduct/${productId}`, {
                method: 'DELETE',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            return productId
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const toggleProductStock = createAsyncThunk(
    'product/toggleProductStock',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/products/${productId}/toggle-stock`, {
                method: 'PATCH',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
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
            if (!data.success) throw new Error(data.message || 'Failed to toggle stock')
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        currentProduct: null,
        categoryProducts: [],
        storeProductsByUsername: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch store products
            .addCase(fetchStoreProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchStoreProducts.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchStoreProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch single product
            .addCase(fetchProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.loading = false
                state.currentProduct = action.payload
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch products by category
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categoryProducts = action.payload
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch products by category slug
            .addCase(fetchProductsByCategorySlug.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
                state.loading = false
                state.categoryProducts = action.payload
            })
            .addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch store products by username
            .addCase(fetchStoreProductsByUsername.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchStoreProductsByUsername.fulfilled, (state, action) => {
                state.loading = false
                state.storeProductsByUsername = action.payload
            })
            .addCase(fetchStoreProductsByUsername.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Add product
            .addCase(addProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false
                state.list.push(action.payload)
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.list.findIndex(prod => prod.id === action.payload.id)
                if (index !== -1) {
                    state.list[index] = action.payload
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.list = state.list.filter(prod => prod.id !== action.payload)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Toggle stock
            .addCase(toggleProductStock.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(toggleProductStock.fulfilled, (state, action) => {
                state.loading = false
                const index = state.list.findIndex(prod => prod.id === action.payload.id)
                if (index !== -1) {
                    state.list[index] = action.payload
                }
            })
            .addCase(toggleProductStock.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { setProduct, clearProduct, setError, clearError } = productSlice.actions

export default productSlice.reducer
