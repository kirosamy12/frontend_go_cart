import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ جلب السلة
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get("https://go-cart-1bwm.vercel.app/api/v1/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
  }
});

// ✅ إنشاء السلة
export const createCart = createAsyncThunk("cart/createCart", async (cartData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post("https://go-cart-1bwm.vercel.app/api/v1/cart", cartData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create cart");
  }
});

// ✅ إضافة منتج للسلة
export const addToCartAsync = createAsyncThunk("cart/addToCart", async (product, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post("https://go-cart-1bwm.vercel.app/api/v1/cart/addToCart", product, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add to cart");
  }
});

// ✅ تحديث السلة
export const updateCart = createAsyncThunk("cart/updateCart", async (updateData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.patch("https://go-cart-1bwm.vercel.app/api/v1/cart/update", updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update cart");
  }
});

// ✅ إنشاء الطلب
export const createOrder = createAsyncThunk("cart/createOrder", async (orderData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post("https://go-cart-1bwm.vercel.app/api/v1/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create order");
  }
});

const initialState = {
  cartItems: {},
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      state.cartItems[productId] = (state.cartItems[productId] || 0) + quantity;
    },
    removeFromCart: (state, action) => {
      delete state.cartItems[action.payload];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
    deleteItemFromCart: (state, action) => {
      delete state.cartItems[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload?.items || {};
        state.total = action.payload?.total || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ تصدير الأكشنات
export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions;

// ✅ تصدير الـ Thunks
export { updateCart, getCart, createCart, addToCartAsync, createOrder };

// ✅ تصدير الـ Reducer (ده فقط الـ default المسموح)
export default cartSlice.reducer;
