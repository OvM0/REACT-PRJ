import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://ecommerce.routemisr.com';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/api/v1/auth/signin`, credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/api/v1/auth/signup`, userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/api/v1/auth/forgotPasswords`, { email });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error sending reset email');
  }
});

export const verifyResetCode = createAsyncThunk('auth/verifyResetCode', async (resetCode, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/api/v1/auth/verifyResetCode`, { resetCode });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid reset code');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, newPassword }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${BASE}/api/v1/auth/resetPassword`, { email, newPassword });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Error resetting password');
  }
});

const getUserFromToken = () => {
  const token = localStorage.getItem('userToken');
  const name = localStorage.getItem('userName');
  if (token) return { token, name };
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromToken(),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('userToken'),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { token: action.payload.token, name: action.payload.user?.name };
        state.isAuthenticated = true;
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('userName', action.payload.user?.name || '');
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { token: action.payload.token, name: action.payload.user?.name };
        state.isAuthenticated = true;
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('userName', action.payload.user?.name || '');
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = { token: action.payload.token };
        state.isAuthenticated = true;
        localStorage.setItem('userToken', action.payload.token);
      });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
