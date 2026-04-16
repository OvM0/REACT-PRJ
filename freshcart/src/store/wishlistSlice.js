import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://ecommerce.routemisr.com';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.get(`${BASE}/api/v1/wishlist`, { headers: { token } });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error fetching wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.post(`${BASE}/api/v1/wishlist`, { productId }, { headers: { token } });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error adding to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.delete(`${BASE}/api/v1/wishlist/${productId}`, { headers: { token } });
    return { ...data, productId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error removing from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    wishlistIds: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlistItems = [];
      state.wishlistIds = [];
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.data || [];
        state.wishlistIds = (action.payload.data || []).map(p => p._id);
        state.count = action.payload.count || 0;
      })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistIds = action.payload.data || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistIds = action.payload.data || [];
        state.wishlistItems = state.wishlistItems.filter(p => p._id !== action.payload.productId);
        state.count = state.wishlistItems.length;
      });
  }
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
