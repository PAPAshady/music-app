import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../services/supabaseClient';

export const signInWithOAuth = createAsyncThunk('auth/signInWithOAuth', async (provider) => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (_, { getState, dispatch }) => {
    const {
      avatar_url: oauth_avatar,
      user_avatar,
      avatar_overridden,
    } = getState().auth.user.user_metadata;
    const avatar = avatar_overridden ? user_avatar : oauth_avatar;
    dispatch(setAvatar(avatar));
  }
);

export const setUser = createAsyncThunk('auth/setUser', async (payload, { dispatch }) => {
  // keep the user and avatar up-to-date
  dispatch(updateUser(payload));
  dispatch(updateUserAvatar());
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    avatar: null,
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.fulfilled, (state) => {
      state.avatar = null;
    });
  },
});

export const { updateUser, setAvatar } = authSlice.actions;
export default authSlice.reducer;
