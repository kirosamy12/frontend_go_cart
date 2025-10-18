import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Categories should be public, so token is optional
            const headers = {
                'Content-Type': 'application/json',
            }

            // Only add token if user is authenticated
            if (auth.token) {
                headers['token'] = auth.token
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/getAllCategories', {
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
            if (!data.success) throw new Error(data.message || 'Failed to fetch categories')
            return data.categories
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (categoryData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch('https://go-cart-1bwm.vercel.app/api/createCategory', {
                method: 'POST',
                headers: {
                    'token': auth.token,
                },
                body: categoryData,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to create category')
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, categoryData }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'token': auth.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.')
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            if (!data.success) throw new Error(data.message || 'Failed to update category')
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (slug, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()

            // Validate token before making request
            if (!auth.token) {
                throw new Error('No authentication token found. Please log in again.')
            }

            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/categories/${slug}`, {
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

            return slug
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCategories: (state) => {
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
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload.map(cat => ({ ...cat, id: cat._id, slug: cat.slug }))
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Add category
            .addCase(addCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false
                state.list.push({ ...action.payload, id: action.payload._id, slug: action.payload.slug })
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Update category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false
                const index = state.list.findIndex(cat => cat.id === action.payload.id)
                if (index !== -1) {
                    state.list[index] = action.payload
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Delete category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false
                state.list = state.list.filter(cat => cat.slug !== action.payload)
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearCategories, setError, clearError } = categorySlice.actions

export default categorySlice.reducer
