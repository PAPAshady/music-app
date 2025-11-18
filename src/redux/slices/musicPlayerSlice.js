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
  const currentSongIndex = getState().musicPlayer.currentSongIndex;
  const queuelist = getState().playContext.currentQueuelist;

  // if queuelist has only one song, play it again in case user clicks on next button
  if (queuelist?.length === 1) {
    music.currentTime = 0;
    dispatch(play());
    return;
  }

  if (currentSongIndex === queuelist?.length - 1) {
    dispatch(setCurrentSongIndex(0));
  } else {
    dispatch(setCurrentSongIndex(currentSongIndex + 1));
  }
});

export const prev = createAsyncThunk('musicPlayer/prev', (_, { getState, dispatch }) => {
  const currentSongIndex = getState().musicPlayer.currentSongIndex;
  const queuelist = getState().playContext.currentQueuelist;

  // if queuelist has only one song, play it again in case user clicks on prev button
  if (queuelist?.length === 1) {
    music.currentTime = 0;
    dispatch(play());
    return;
  }

  if (currentSongIndex === 0) {
    dispatch(setCurrentSongIndex(queuelist?.length - 1));
  } else {
    dispatch(setCurrentSongIndex(currentSongIndex - 1));
  }
});

export const resetPlayer = createAsyncThunk('musicPlayer/resetPlayer', (_, { dispatch }) => {
  music.src = '';
  dispatch(setIsPlaying(false));
  dispatch(setCurrentSongIndex(0));
  dispatch(setPrevSongIndex(null));
  dispatch(setCurrentMusic(null));
  dispatch(setMusicState('loading'));
});

// an utility function to convert milliseconds into currect time format
export const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  const fomrattedMinsAndSeconds = `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (hours) {
    const formattedHours = `${hours.toString().padStart(2, '0')}:`;
    return formattedHours + fomrattedMinsAndSeconds;
  }

  return fomrattedMinsAndSeconds;
};

const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState: {
    isPlaying: false,
    currentSongIndex: 0,
    prevSongIndex: null,
    currentMusic: null,
    musicState: 'loading',
    playingState: 'repeat_all',
    bufferProgressPercentage: 0,
    autoLyricsTracker: true,
    volume: 70,
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
    setCurrentMusic(state, action) {
      state.currentMusic = action.payload;
    },
    setPlayingState(state, action) {
      state.playingState = action.payload;
    },
    setMusicState(state, action) {
      const validStates = ['initial_loading', 'buffering', 'playable'];

      if (!validStates.includes(action.payload)) {
        throw new Error(
          `Invalid actionType "${action.payload}" passed to setMusicState. Valid types are: ${validStates.join(', ')}.`
        );
      }
      state.musicState = action.payload;
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
    setBufferProgressPercentage(state, action) {
      state.bufferProgressPercentage = action.payload;
    },
    setAutoLyricsTracker(state, action) {
      state.autoLyricsTracker = action.payload;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
  },
});

export const {
  setIsPlaying,
  setCurrentSongIndex,
  setPrevSongIndex,
  setCurrentMusic,
  setPlayingState,
  togglePlayState,
  setMusicState,
  setBufferProgressPercentage,
  setAutoLyricsTracker,
  setVolume,
} = musicPlayerSlice.actions;
export default musicPlayerSlice.reducer;
