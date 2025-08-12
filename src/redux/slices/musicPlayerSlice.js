import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const music = new Audio();

export const play = createAsyncThunk('musicPlayer/play', (_, { dispatch }) => {
  music.play();
  dispatch(setIsPlaying(true));
});

export const pause = createAsyncThunk('musicPlayer/pause', (_, { dispatch }) => {
  music.pause();
  dispatch(setIsPlaying(false));
});

export const next = createAsyncThunk('musicPlayer/next', (_, { getState, dispatch }) => {
  const { playlist, currentSongIndex } = getState().musicPlayer;

  // if playlist has only one song, play it again in case user clicks on next button
  if (playlist.musics?.length === 1) {
    music.currentTime = 0;
    dispatch(play());
    return;
  }

  if (currentSongIndex === playlist.musics?.length - 1) {
    dispatch(setCurrentSongIndex(0));
  } else {
    dispatch(setCurrentSongIndex(currentSongIndex + 1));
  }
});

export const prev = createAsyncThunk('musicPlayer/prev', (_, { getState, dispatch }) => {
  const { playlist, currentSongIndex } = getState().musicPlayer;

  // if playlist has only one song, play it again in case user clicks on prev button
  if (playlist.musics?.length === 1) {
    music.currentTime = 0;
    dispatch(play());
    return;
  }

  if (currentSongIndex === 0) {
    dispatch(setCurrentSongIndex(playlist.musics?.length - 1));
  } else {
    dispatch(setCurrentSongIndex(currentSongIndex - 1));
  }
});

const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState: {
    isPlaying: false,
    currentSongIndex: 0,
    prevSongIndex: 0,
    playlist: {},
    selectedPlaylist: {},
    playingState: 'repeat_all',
  },
  reducers: {
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setCurrentSongIndex(state, action) {
      state.currentSongIndex = action.payload;
    },
    setPrevSongIndex(state, action) {
      state.prevSongIndex = action.payload;
    },
    setPlayState(state, action) {
      state.playingState = action.payload;
    },
    setPlaylist(state, action) {
      state.playlist = action.payload;
    },
    setSelectedPlaylist(state, action) {
      state.selectedPlaylist = action.payload;
    },
    setSelectedPlaylistSongs(state, action) {
      state.selectedPlaylist.musics = action.payload;
    },
    togglePlayState(state) {
      const playingStateOptions = ['repeat_all', 'repeat_one', 'shuffle'];
      const currentPlayStateIndex = playingStateOptions.indexOf(state.playingState);
      if (currentPlayStateIndex === playingStateOptions.length - 1) {
        state.playingState = playingStateOptions[0];
      } else {
        state.playingState = playingStateOptions[currentPlayStateIndex + 1];
      }
    },
  },
});

export const {
  setIsPlaying,
  setCurrentSongIndex,
  setPrevSongIndex,
  setPlayState,
  togglePlayState,
  setPlaylist,
  setSelectedPlaylist,
  setSelectedPlaylistSongs,
} = musicPlayerSlice.actions;
export default musicPlayerSlice.reducer;
