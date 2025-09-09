import { createSlice } from '@reduxjs/toolkit';

const playContextSlice = createSlice({
  name: 'playContext',
  initialState: {
    isSingleSong: false,
    selectedCollection: {},
    currentCollection: {},
    singleSong: {},
    currentQueuelist: [],
  },
  reducers: {
    setIsSingleSong(state, action) {
      state.isSingleSong = action.payload;
    },
    setSelectedCollection(state, action) {
      state.isSingleSong = false;
      state.selectedCollection = action.payload;
    },
    setSelectedCollectionTracks(state, action) {
      state.selectedCollection = {
        ...state.selectedCollection,
        tracks: action.payload,
      };
    },
    setCurrentCollection(state, action) {
      state.isSingleSong = false;
      state.currentCollection = action.payload;
      state.currentQueuelist = state.selectedCollection.tracks;
    },

    setSingleSong(state, action) {
      state.isSingleSong = true;
      state.selectedCollection = {};
      state.currentCollection = {};
      state.singleSong = action.payload;
    },
    setCurrentQueuelist(state, action) {
      state.currentQueuelist = action.payload;
    },
  },
});

export const {
  setIsSingleSong,
  setSelectedCollection,
  setSelectedCollectionTracks,
  setCurrentCollection,
  setSingleSong,
  setCurrentQueuelist,
} = playContextSlice.actions;
export default playContextSlice.reducer;
