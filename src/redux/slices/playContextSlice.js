import { createSlice } from '@reduxjs/toolkit';
import favoriteSongsCover from '../../assets/images/covers/favorites-cover.png';

const initialState = {
  isSingleSong: false,
  selectedCollection: {},
  currentCollection: {},
  singleSong: {}, // the song which is currently playing
  selectedSong: {}, // the song which user selcted to play initially.
  currentQueuelist: [],
};

const playContextSlice = createSlice({
  name: 'playContext',
  initialState,
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
    resetCurrentCollection(state) {
      state.isSingleSong = false;
      state.currentCollection = {};
      state.currentQueuelist = [];
    },
    setSelectedSong(state, action) {
      state.selectedSong = action.payload;
    },
    resetPlayContext() {
      return initialState;
    },
  },
});

export const favoriteSongsInfos = {
  title: 'Favorite songs',
  cover: favoriteSongsCover,
  description: 'A collection of your favorite songs!',
  tracklistType: 'favorites',
  id: 'favorites',
};

export const {
  setIsSingleSong,
  setSelectedCollection,
  setSelectedCollectionTracks,
  setCurrentCollection,
  setSingleSong,
  setCurrentQueuelist,
  resetCurrentCollection,
  setSelectedSong,
  resetPlayContext,
} = playContextSlice.actions;
export default playContextSlice.reducer;
