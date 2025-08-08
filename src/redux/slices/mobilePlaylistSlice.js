import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const openMobilePlaylist = createAsyncThunk(
  'mobilePlaylist/openMobilePlaylist',
  (_, { getState }) => {
    const { isOpen } = getState();
    const isLargeTablet = window.matchMedia('(max-width: 1280px)');

    // do not add a history if user is not using a mobile/tablet device or if mobile playlist is already open
    if (!isOpen && isLargeTablet) {
      window.history.pushState({ mobilePlaylist: true }, '');
    }

    return true;
  }
);

export const closeMobilePlaylist = createAsyncThunk('mobilePlaylist/closeMobilePlaylist', () => {
  window.history.back();

  // --- ATTENTION ---  Since MusicPlayerContext hasn't refactored yet to redux, we can't implement the following logic:

  // After viewing a different playlist's details, reset selectedPlaylist to the currently playing one.
  // This ensures that the next time the user opens the mobile playlist, it shows the correct (current) playlist info.
  // setSelectedPlaylist(playlist);

  return true;
});

export const toggleMobilePlaylist = createAsyncThunk(
  'mobilePlaylist/toggleMobilePlaylist',
  (_, { dispatch, getState }) => {
    const { isOpen } = getState().mobilePlaylist;
    dispatch(isOpen ? closeMobilePlaylist() : openMobilePlaylist());
  }
);

const mobilePlaylistSlice = createSlice({
  name: 'mobilePlaylist',
  initialState: { isOpen: false },
  reducers: {
    setIsMobilePlaylistOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(openMobilePlaylist.fulfilled, (state) => {
        state.isOpen = true;
      })
      .addCase(closeMobilePlaylist.fulfilled, (state) => {
        state.isOpen = false;
      });
  },
});

export const { setIsMobilePlaylistOpen } = mobilePlaylistSlice.actions;
export default mobilePlaylistSlice.reducer;
