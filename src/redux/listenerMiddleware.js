import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setUser } from './slices/authSlice';
import { getUserAvatar } from './slices/authSlice';
import { music, setPrevSongIndex, setCurrentSongIndex, play } from './slices/musicPlayerSlice';

const listenerMiddleware = createListenerMiddleware();

// Previously, if a user logged out and logged in again with a different account,
// their avatar wouldn't update. This listener ensures the avatar is refreshed when the user changes.
listenerMiddleware.startListening({
  actionCreator: setUser,
  effect: (action, { dispatch }) => {
    const userId = action.payload?.id;
    userId && dispatch(getUserAvatar(userId));
  },
});

// update music src everytime currentSongIndex changes
listenerMiddleware.startListening({
  actionCreator: setCurrentSongIndex,
  effect: (action, { getState, dispatch }) => {
    const { playlist, currentSongIndex } = getState().musicPlayer;
    // dont try to play music onMount (because there is no music on Mount) to avoid errors.
    if (playlist.musics?.length) {
      music.src = playlist.musics?.[action.payload]?.song_url;
      dispatch(setPrevSongIndex(currentSongIndex));
      dispatch(play());
    }
  },
});

export default listenerMiddleware;
