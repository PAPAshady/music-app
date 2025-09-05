import { createSlice } from '@reduxjs/toolkit';

const playContextSlice = createSlice({
  name: 'queueList',
  initialState: {
    isSelectedTracklist: false, // Determine whether the user has selected a single song or a tracklist.
    isPlayingTracklist: false, // Determine whether the user is currently playing a single song or a tracklist.
    selectedContext: {}, // A tracklist or single song that the user has selected.
    playingContext: {}, // A tracklist or single song that the user is currenlt playing.
    selectedContextQueueList: [],
    playingContextQueueList: [],
  },
  reducers: {
    setIsSelectedTracklist(state, action) {
      state.isSelectedTracklist = action.payload;
    },
    setIsPlayingTracklist(state, action) {
      state.isPlayingTracklist = action.payload;
    },
    setSelectedContext(state, action) {
      const selectedContextType = action.payload.tracklistType;
      const isTracklist = selectedContextType === 'playlist' || selectedContextType === 'album';
      state.selectedContext = action.payload;
      if (isTracklist) {
        state.isSelectedTracklist = true;
      } else {
        state.isSelectedTracklist = false;
        state.selectedContextQueueList = [action.payload];
      }
    },
    setSelectedContextSongs(state, action) {
      state.selectedContextQueueList = action.payload;
    },
    setPlayingContext(state, action) {
      const playingContextType = action.payload.tracklistType;
      const isTracklist = playingContextType === 'playlist' || playingContextType === 'album';
      state.playingContext = action.payload;
      isTracklist ? (state.isPlayingTracklist = true) : (state.isPlayingTracklist = false);
      state.playingContextQueueList = state.selectedContextQueueList;
    },
    setPlayingContextSongs(state, action) {
      state.playingContextQueueList = action.payload;
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
  setIsSelectedTracklist,
  setIsPlayingTracklist,
  setSelectedContext,
  setSelectedContextSongs,
  setPlayingContext,
  setPlayingContextSongs,
  clearSelectedContext,
  clearPlayingContext,
} = playContextSlice.actions;
export default playContextSlice.reducer;
