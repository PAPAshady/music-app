import { createSlice } from '@reduxjs/toolkit';

const playContextSlice = createSlice({
  name: 'queueList',
  initialState: {
    selectedContext: {},
    playingContext: {},
  },
  reducers: {
    setSelectedContext(state, action) {
      state.selectedContext = action.payload;
    },
    setSelectedContextSongs(state, action) {
      state.selectedContext.musics = action.payload;
    },
    setPlayingContext(state, action) {
      state.playingContext = action.payload;
    },
    setPlayingContextSongs(state, action) {
      state.playingContext.musics = action.payload;
    },
    clearSelectedContext(state) {
      state.selectedContext = {};
    },
    clearPlayingContext(state) {
      state.playingContext = {};
    },
  },
});

export const {
  setSelectedContext,
  setSelectedContextSongs,
  setPlayingContext,
  setPlayingContextSongs,
  clearSelectedContext,
  clearPlayingContext,
} = playContextSlice.actions;
export default playContextSlice.reducer;
