import { createListenerMiddleware } from '@reduxjs/toolkit';
import queryClient from '../queryClient';
import { getSongsByTracklistIdQueryOptions } from '../queries/musics';
import { setUser } from './slices/authSlice';
import { getUserAvatar } from './slices/authSlice';
import { setSelectedPlaylistSongs, setCurrentMusic } from './slices/musicPlayerSlice';
import {
  music,
  setPrevSongIndex,
  setCurrentSongIndex,
  play,
  setSelectedPlaylist,
  setSongTotalDurations,
  formatTime,
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
  effect: (action, { getState, dispatch, signal, getOriginalState }) => {
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

    // calculate the duration of the new song
    const formatSongDuration = () => {
      dispatch(
        setSongTotalDurations({
          rawDuration: music.duration,
          formatedDuration: formatTime(music.duration),
        })
      );
    };

    music.addEventListener('loadedmetadata', formatSongDuration);

    // Cleanup previous event listeners
    signal.addEventListener('abort', () => {
      music.removeEventListener('loadedmetadata', formatSongDuration);
    });
  },
});

// fetch the songs of selected tracklist (playlist or album) and save them in redux store.
listenerMiddleware.startListening({
  actionCreator: setSelectedPlaylist,
  effect: async (action, { dispatch }) => {
    const { tracklistType, id } = action.payload;
    const songs = await queryClient.fetchQuery(
      getSongsByTracklistIdQueryOptions(id, tracklistType)
    );

    // we store the songs of the selected tracklist to keep track of them and do some things like
    // calculating prev/next songs ids to determine their playing order and etc.
    dispatch(setSelectedPlaylistSongs(songs));
  },
});

export default listenerMiddleware;
