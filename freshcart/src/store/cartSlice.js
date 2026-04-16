import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://ecommerce.routemisr.com';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.get(`${BASE}/api/v1/cart`, {
      headers: { token }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error fetching cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.post(`${BASE}/api/v1/cart`, { productId }, {
      headers: { token }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error adding to cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.delete(`${BASE}/api/v1/cart/${productId}`, {
      headers: { token }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error removing from cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, count }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.put(`${BASE}/api/v1/cart/${productId}`, { count }, {
      headers: { token }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error updating cart');
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.delete(`${BASE}/api/v1/cart`, {
      headers: { token }
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error clearing cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    cartId: null,
    totalPrice: 0,
    numOfCartItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.cartId = null;
      state.totalPrice = 0;
      state.numOfCartItems = 0;
    }
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.data?.products || [];
      state.cartId = action.payload.data?._id || null;
      state.totalPrice = action.payload.data?.totalCartPrice || 0;
      state.numOfCartItems = action.payload.numOfCartItems || 0;
    };
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.numOfCartItems = 0; })
      .addCase(addToCart.pending, (state) => { state.loading = true; })
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.cartId = null;
        state.totalPrice = 0;
        state.numOfCartItems = 0;
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
