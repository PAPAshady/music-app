import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setSelectedCollection } from './playContextSlice';

export const openMobilePlaylist = createAsyncThunk(
  'mobilePlaylist/openMobilePlaylist',
  (_, { getState, dispatch }) => {
    const { isOpen } = getState();
    const isLargeTablet = window.matchMedia('(max-width: 1280px)');

    // do not add a history if user is not using a mobile/tablet device or if mobile playlist is already open
    if (!isOpen && isLargeTablet) {
      window.history.pushState({ mobilePlaylist: true }, '');
    }

    dispatch(setIsMobilePlaylistOpen(true));
  }
);

export const closeMobilePlaylist = createAsyncThunk(
  'mobilePlaylist/closeMobilePlaylist',
  (_, { dispatch, getState }) => {
    window.history.back();
    const currentCollection = getState().currentCollection.currentCollection;

    dispatch(setIsMobilePlaylistOpen(false));
    // After viewing a different playlist's details, reset selectedPlaylist to the currently playing one.
    // This ensures that the next time the user opens the mobile playlist, it shows the correct (current) playlist info.
    dispatch(setSelectedCollection(currentCollection));
  }
);

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
});

export const { setIsMobilePlaylistOpen } = mobilePlaylistSlice.actions;
export default mobilePlaylistSlice.reducer;
