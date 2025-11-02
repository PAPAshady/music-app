import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserAvatarUrl } from '../../services/users';
import supabase from '../../services/supabaseClient';
import queryClient from '../../queryClient';

export const signInWithOAuth = createAsyncThunk('auth/signInWithOAuth', async (provider) => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  queryClient.invalidateQueries();
});

export const getUserAvatar = createAsyncThunk('auth/getUserAvatar', async (userId) => {
  return await getUserAvatarUrl(userId);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    avatar: null,
    isLoading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAvatar.fulfilled, (state, action) => {
        state.avatar = action.payload || state.user.user_metadata.avatar_url;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.avatar = null;
      });
  },
});

export const { setUser, setLoading, setAvatar } = authSlice.actions;
export default authSlice.reducer;
