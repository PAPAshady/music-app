import { createListenerMiddleware } from '@reduxjs/toolkit';
import queryClient from '../queryClient';
import supabase from '../services/supabaseClient';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getRelatedSongsBySongDataQueryOptions,
} from '../queries/musics';
import { setUser } from './slices/authSlice';
import { getUserAvatar } from './slices/authSlice';
import { setCurrentMusic } from './slices/musicPlayerSlice';
import { music, setPrevSongIndex, setCurrentSongIndex, play } from './slices/musicPlayerSlice';
import {
  setCurrentQueuelist,
  setSelectedCollection,
  setSelectedCollectionTracks,
  setSingleSong,
} from './slices/playContextSlice';

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
  effect: async (action, { getState, dispatch, getOriginalState }) => {
    // update music src everytime currentSongIndex changes
    const currentSongIndex = getState().musicPlayer.currentSongIndex;
    const queuelist = getOriginalState().playContext.currentQueuelist;

    const { currentSongIndex: prevSongIndex } = getOriginalState().musicPlayer;
    // dont try to play music onMount (because there is no music on Mount) to avoid errors.
    if (queuelist?.length) {
      music.src = queuelist[action.payload]?.song_url;
      dispatch(setPrevSongIndex(prevSongIndex));
      // update current song to the new one
      dispatch(setCurrentMusic(queuelist[currentSongIndex]));
      dispatch(play());

      // update the play_count in database everytime a user plays the song to determine its popularity
      await supabase.rpc('increment_play', {
        song_id: queuelist[currentSongIndex].id,
      });
    }
  },
});

// fetch the songs of selected tracklist (playlist or album) and save them in redux store.
listenerMiddleware.startListening({
  actionCreator: setSelectedCollection,
  effect: async (action, { dispatch }) => {
    const song = action.payload;
    const songs = await queryClient.fetchQuery(
      song.tracklistType === 'album'
        ? getSongsByAlbumIdQueryOptions(song.id)
        : getSongsByPlaylistIdQueryOptions(song.id)
    );

    // we store the songs of the selected tracklist to keep track of them and do some things like
    // calculating prev/next songs ids to determine their playing order and etc.
    dispatch(setSelectedCollectionTracks(songs));
  },
});

// fetch the related songs to selected musics and save them in redux store.
listenerMiddleware.startListening({
  actionCreator: setSingleSong,
  effect: async (action, { dispatch }) => {
    const songs = await queryClient.fetchQuery(
      getRelatedSongsBySongDataQueryOptions(action.payload)
    );

    dispatch(setCurrentQueuelist(songs));
  },
});

export default listenerMiddleware;
