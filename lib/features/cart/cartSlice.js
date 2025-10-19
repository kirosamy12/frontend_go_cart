'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ العمليات غير المتزامنة (Async Thunks)
const API_BASE_URL = 'https://go-cart-1bwm.vercel.app';

const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const createCart = createAsyncThunk('cart/createCart', async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/cart`, userData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async (item, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/cart/add`, item);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const updateCart = createAsyncThunk('cart/updateCart', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch(`${API_BASE_URL}/api/cart/${data.id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const createOrder = createAsyncThunk('cart/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// ✅ الحالة الابتدائية (Initial State)
const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// ✅ إنشاء Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    deleteItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// ✅ تصدير الأكشنز والدوال مرة واحدة فقط
export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions;

// ✅ تصدير الـ Thunks
export { getCart, createCart, addToCartAsync, updateCart, createOrder };

// ✅ تصدير الـ Reducer (الوحيد كـ default)
export default cartSlice.reducer;
