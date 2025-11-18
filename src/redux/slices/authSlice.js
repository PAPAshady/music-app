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

export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (_, { getState, dispatch }) => {
    const userId = getState().auth.user.id;
    const avatar = await getUserAvatarUrl(userId); // the avatar which user uploaded him self
    const oAuthAvatar = getState().auth.user.user_metadata.avatar_url; // the avatar which user got from supabase OAuth 2.0 authentication (from github, google, etc.)
    dispatch(setAvatar(avatar || oAuthAvatar));
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
    isLoading: true,
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
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
    builder.addCase(signOut.fulfilled, (state) => {
      state.avatar = null;
    });
  },
});

export const { updateUser, setLoading, setAvatar } = authSlice.actions;
export default authSlice.reducer;
