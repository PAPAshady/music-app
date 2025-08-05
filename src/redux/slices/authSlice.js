import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserAvatarUrl } from '../../services/users';
import supabase from '../../services/supabaseClient';

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, user_name, first_name, last_name }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_name, full_name: `${first_name} ${last_name}` } },
    });
    if (error) throw error;
  }
);

export const signIn = createAsyncThunk('auth/signIn', async (formData) => {
  const { error } = await supabase.auth.signInWithPassword({ ...formData });
  if (error) throw error;
});

export const signInWithOAuth = createAsyncThunk('auth/signInWithOAuth', async (provider) => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
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
        state.avatar = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.avatar = null;
      });
  },
});

export const { setUser, setLoading, setAvatar } = authSlice.actions;
export default authSlice.reducer;
