import { createListenerMiddleware } from '@reduxjs/toolkit';
import queryClient from '../queryClient';
import supabase from '../services/supabaseClient';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getGeneratedQueuelistBySongDataQueryOptions,
  getFavoriteSongsQueryOptions,
} from '../queries/musics';
import { setCurrentMusic } from './slices/musicPlayerSlice';
import { music, setPrevSongIndex, setCurrentSongIndex, play } from './slices/musicPlayerSlice';
import {
  setCurrentCollection,
  setCurrentQueuelist,
  setSelectedCollection,
  setSelectedCollectionTracks,
  setSelectedSong,
} from './slices/playContextSlice';

const listenerMiddleware = createListenerMiddleware();

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

      const userId = getState().auth.user.id;
      // update the play_count per user in database everytime a user plays the song to determine its popularity
      await supabase.rpc('increment_play_per_user', {
        _user_id: userId,
        _target_id: queuelist[currentSongIndex].id,
        _target_type: 'song',
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
        : song.tracklistType === 'playlist'
          ? getSongsByPlaylistIdQueryOptions(song.id)
          : getFavoriteSongsQueryOptions()
    );

    // we store the songs of the selected tracklist to keep track of them and do some things like
    // calculating prev/next songs ids to determine their playing order and etc.
    dispatch(setSelectedCollectionTracks(songs));
  },
});

// fetch the related songs to selected musics and save them in redux store.
listenerMiddleware.startListening({
  actionCreator: setSelectedSong,
  effect: async (action, { dispatch }) => {
    if (action.payload.id) { // only run the query if the song exists.
      const songs = await queryClient.fetchQuery(
        getGeneratedQueuelistBySongDataQueryOptions(action.payload)
      );

      dispatch(setCurrentQueuelist(songs)); // add the selected song to the queuelist
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: setCurrentCollection,
  effect: async (action, { getState }) => {
    if (action.payload.id !== 'favorites') {
      const userId = getState().auth.user.id;
      // update the play_count per user in database everytime a user plays a album/playlist to determine its popularity
      await supabase.rpc('increment_play_per_user', {
        _user_id: userId,
        _target_id: action.payload.id,
        _target_type: action.payload.tracklistType,
      });
    }
  },
});

export default listenerMiddleware;
