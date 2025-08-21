import { queryOptions } from '@tanstack/react-query';
import {
  setSelectedPlaylistSongs,
  setPlaylistSongs,
  setCurrentMusic,
  setCurrentSongIndex,
  pause,
  music,
} from '../redux/slices/musicPlayerSlice';
import store from '../redux/store';
import queryClient from '../queryClient';
import {
  getAllPlaylists,
  getAllPrivatePlaylists,
  getAllPublicPlaylists,
  createNewPrivatePlaylist,
  updatePrivatePlaylist,
  addSongToPrivatePlaylist,
  removeSongFromPrivatePlaylist,
} from '../services/playlists';

export const getAllPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists'],
    queryFn: getAllPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getAllPublicPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: true }],
    queryFn: getAllPublicPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getAllPrivatePlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false }],
    queryFn: getAllPrivatePlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const createNewPrivatePlaylistQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false }],
    mutationFn: (data) => createNewPrivatePlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
    },
  });
};

export const updatePrivatePlaylistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false, playlistId }],
    mutationFn: (newData) => updatePrivatePlaylist(playlistId, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
    },
  });
};

export const addSongToPrivatePlaylistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { playlistId }],
    mutationFn: (songId) => addSongToPrivatePlaylist(playlistId, songId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playlists', { playlistId }] });
      // sync with redux
      const updatedPlaylistSongs = queryClient.getQueryData(['playlists', { playlistId }]);
      const playlist = store.getState().musicPlayer.playlist; // the playlist which is currently playing
      store.dispatch(setSelectedPlaylistSongs(updatedPlaylistSongs));
      if (playlist.id === playlistId) {
        // if user updated the music list of current playing playlist, sync the updates in redux as well
        store.dispatch(setPlaylistSongs(updatedPlaylistSongs));
      }
    },
  });
};

export const removeSongFromPrivatePlaylistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { playlistId }],
    mutationFn: (songId) => removeSongFromPrivatePlaylist(playlistId, songId),
    onSuccess: async (_, songId) => {
      await queryClient.invalidateQueries({ queryKey: ['playlists', { playlistId }] });
      // sync with redux
      const updatedPlaylistSongs = queryClient.getQueryData(['playlists', { playlistId }]);
      const playlist = store.getState().musicPlayer.playlist; // the playlist which is currently playing
      const musicPlayer = store.getState().musicPlayer;
      const { dispatch } = store;
      dispatch(setSelectedPlaylistSongs(updatedPlaylistSongs));
      if (playlist.id === playlistId) {
        // if user updated the music list of current playlist, sync the updates in redux as well
        dispatch(setPlaylistSongs(updatedPlaylistSongs));

        // handle the case if user removed the current playing song from the current playlist.
        if (musicPlayer.currentMusic?.id === songId) {
          if (updatedPlaylistSongs.length === 0) {
            // playlist empty -> stop
            dispatch(pause());
            music.src = '';
            dispatch(setCurrentMusic(null));
            dispatch(setCurrentSongIndex(0));
            return;
          }

          // determine new index: prefer same index (which now points to next song after deletion),
          // otherwise clamp to last index
          const newIndex = Math.min(musicPlayer.currentSongIndex, updatedPlaylistSongs.length - 1);

          // update store
          dispatch(setCurrentSongIndex(newIndex));
        }
      }
    },
  });
};
