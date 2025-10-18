import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        total: 0,
        wishlistItems: [],
    },
    reducers: {
        addToWishlist: (state, action) => {
            const { productId } = action.payload
            if (!state.wishlistItems.includes(productId)) {
                state.wishlistItems.push(productId)
                state.total += 1
            }
        },
        removeFromWishlist: (state, action) => {
            const { productId } = action.payload
            const index = state.wishlistItems.indexOf(productId)
            if (index > -1) {
                state.wishlistItems.splice(index, 1)
                state.total -= 1
            }
        },
        clearWishlist: (state) => {
            state.wishlistItems = []
            state.total = 0
        },
    }
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
