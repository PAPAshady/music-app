import { createSlice } from '@reduxjs/toolkit';

const playContextSlice = createSlice({
  name: 'playContext',
  initialState: {
    isSingleSong: false,
    selectedCollection: {},
    currentCollection: {},
    singleSong: {},
    currentQueuelist: [],
    queuelistType: null, // could be on of the followings: [null, 'album', 'playlist', 'related_songs', 'artist_popular_songs']
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
      state.queuelistType = action.payload.tracklistType;
    },

    setSingleSong(state, action) {
      state.isSingleSong = true;
      state.selectedCollection = {};
      state.currentCollection = {};
      state.singleSong = action.payload;
      state.queuelistType = 'related_songs';
    },
    setCurrentQueuelist(state, action) {
      state.currentQueuelist = action.payload;
    },
    setQueuelistType(state, action) {
      state.queuelistType = action.payload;
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
  setQueuelistType,
} = playContextSlice.actions;
export default playContextSlice.reducer;
