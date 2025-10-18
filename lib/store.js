import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import categoryReducer from './features/category/categorySlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'
import authReducer from './features/auth/authSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import ordersReducer from './features/orders/ordersSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            category: categoryReducer,
            address: addressReducer,
            rating: ratingReducer,
            auth: authReducer,
            wishlist: wishlistReducer,
            orders: ordersReducer,
        },
    })
}
