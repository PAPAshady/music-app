import { createListenerMiddleware } from '@reduxjs/toolkit';
import queryClient from '../queryClient';
import { getSongsByAlbumIdQueryOptions } from '../queries/musics';
import { setUser } from './slices/authSlice';
import { getUserAvatar } from './slices/authSlice';
import { setSelectedPlaylistSongs, setCurrentMusic } from './slices/musicPlayerSlice';
import {
  music,
  setPrevSongIndex,
  setCurrentSongIndex,
  play,
  setSelectedPlaylist,
} from './slices/musicPlayerSlice';

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

listenerMiddleware.startListening({
  actionCreator: setCurrentSongIndex,
  effect: (action, { getState, dispatch, getOriginalState }) => {
    // update music src everytime currentSongIndex changes
    const { playlist, currentSongIndex } = getState().musicPlayer;
    const { currentSongIndex: prevSongIndex } = getOriginalState().musicPlayer;
    // dont try to play music onMount (because there is no music on Mount) to avoid errors.
    if (playlist.musics?.length) {
      music.src = playlist.musics[action.payload]?.song_url;
      dispatch(setPrevSongIndex(prevSongIndex));
      // update current song to the new one
      dispatch(setCurrentMusic(playlist.musics[currentSongIndex]));
      dispatch(play());
    }
  },
});

// fetch the songs of selected tracklist (playlist or album) and save them in redux store.
listenerMiddleware.startListening({
  actionCreator: setSelectedPlaylist,
  effect: async (action, { dispatch }) => {
    const { id } = action.payload;
    const songs = await queryClient.fetchQuery(
      getSongsByAlbumIdQueryOptions(id)
    );

    // we store the songs of the selected tracklist to keep track of them and do some things like
    // calculating prev/next songs ids to determine their playing order and etc.
    dispatch(setSelectedPlaylistSongs(songs));
  },
});

export default listenerMiddleware;
