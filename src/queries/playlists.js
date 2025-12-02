import { queryOptions } from '@tanstack/react-query';
import {
  setCurrentMusic,
  setCurrentSongIndex,
  pause,
  music,
  resetPlayer,
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
  deletePrivatePlaylist,
  getPlaylistById,
  getFavoritePlaylists,
  getTrendingPlaylists,
  getRecommendedPlaylists,
  getPlaylistsByGenre,
  getUserSubscribedPlaylists,
  subscribeToPlaylist,
  unsubscribeFromPlaylist,
  getRecentlyPlayedPlaylists,
  getPlaylistsByKeyword,
} from '../services/playlists';
import {
  setCurrentQueuelist,
  setSelectedCollectionTracks,
  resetCurrentCollection,
  setSelectedCollection,
} from '../redux/slices/playContextSlice';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { closeMobilePanel } from '../redux/slices/mobilePanelSlice';
import { setQueries } from '../redux/slices/queryStateSlice';

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

export const getPlaylistByIdQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { playlistId }],
    queryFn: () => getPlaylistById(playlistId),
    staleTime: Infinity,
    enabled: !!playlistId,
  });
};

export const createNewPrivatePlaylistMutationOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false }],
    mutationFn: (data) => createNewPrivatePlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
      store.dispatch(addNotification('Your new playlist has been created!'));
    },
  });
};

export const updatePrivatePlaylistMutationOptions = (playlistId) => ({
  queryKey: ['playlists', { is_public: false, playlistId }],
  mutationFn: (newData) => updatePrivatePlaylist(playlistId, newData),
  enabled: !!playlistId,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
});

export const deletePrivatePlaylistMutationOptions = (playlistId) => ({
  queryKey: ['playlists', { is_public: false }],
  mutationFn: () => deletePrivatePlaylist(playlistId),
  enabled: !!playlistId,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['playlists'] });
    const currentQuelistId = store.getState().playContext.currentCollection?.id;
    const selectedQuelistId = store.getState().playContext.selectedCollection?.id;
    const isCurrentPlaylistPlaying = currentQuelistId === playlistId;
    const isCurrentPlaylistSelected = selectedQuelistId === playlistId;
    // if user removed the playlists while it is playing, reset the music player and current playlist in redux.
    if (isCurrentPlaylistPlaying) {
      store.dispatch(resetCurrentCollection());
      store.dispatch(resetPlayer());
    }

    // if user removed the playlists while it is selected, reset the selected playlist in redux, close the mobile panel and reset the query state
    if (isCurrentPlaylistSelected) {
      store.dispatch(setSelectedCollection({}));
      store.dispatch(closeMobilePanel());
      store.dispatch(setQueries({ type: null, id: null }));
    }
  },
});

export const addSongToPrivatePlaylistMutationOptions = (playlistId) => ({
  queryKey: ['playlists', { playlistId }],
  mutationFn: (songId) => addSongToPrivatePlaylist(playlistId, songId),
  enabled: !!playlistId,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['songs', { playlistId }] });

    // update playlists cache to show the new value of totaltracks field
    queryClient.setQueryData(['playlists', { is_public: false }], (prevPlaylists) => {
      return prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, totaltracks: playlist.totaltracks + 1 }
          : playlist
      );
    });

    const updatedPlaylistSongs = queryClient.getQueryData(['songs', { playlistId }]);
    const playingTracklist = store.getState().playContext.currentCollection; // the playlist which is currently playing
    // sync with redux
    store.dispatch(setSelectedCollectionTracks(updatedPlaylistSongs));
    if (playingTracklist.id === playlistId) {
      // if user updated the music list of current playing playlist, sync the updates in redux as well
      store.dispatch(setCurrentQueuelist(updatedPlaylistSongs));
    }
  },
});

export const removeSongFromPrivatePlaylistMutationOptions = (playlistId) => ({
  queryKey: ['playlists', { playlistId }],
  mutationFn: (songId) => removeSongFromPrivatePlaylist(playlistId, songId),
  enabled: !!playlistId,
  onSuccess: async (_, songId) => {
    const updatedPlaylistSongs = queryClient.setQueryData(
      ['songs', { playlistId }],
      (prevPlaylistSongs) => {
        if (!prevPlaylistSongs) return [];
        return prevPlaylistSongs.filter((song) => song.id !== songId);
      }
    );

    // update playlists cache to show the new value of totaltracks field
    queryClient.setQueryData(['playlists', { is_public: false }], (prevPlaylists) => {
      return prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, totaltracks: playlist.totaltracks - 1 }
          : playlist
      );
    });

    const playingTracklist = store.getState().playContext.currentCollection; // the playlist which is currently playing
    const musicPlayer = store.getState().musicPlayer;
    const { dispatch } = store;
    // sync with redux
    dispatch(setSelectedCollectionTracks(updatedPlaylistSongs));
    if (playingTracklist.id === playlistId) {
      // if user updated the music list of current playlist, sync the updates in redux as well
      dispatch(setCurrentQueuelist(updatedPlaylistSongs));

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

export const getFavoritePlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_liked: true }],
    queryFn: getFavoritePlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getTrendingPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_trending: true }],
    queryFn: getTrendingPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getRecommendedPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_recommended: true }],
    queryFn: getRecommendedPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getPlaylistsByGenreQueryOptions = (genreId) => {
  return queryOptions({
    queryKey: ['playlists', { genreId }],
    queryFn: () => getPlaylistsByGenre(genreId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!genreId,
  });
};

export const getUserSubscribedPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_subscribed: true }],
    queryFn: getUserSubscribedPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const subscribeToPlaylistMutationOptions = () => {
  return {
    queryKey: ['playlists', { is_subscribed: true }],
    mutationFn: subscribeToPlaylist,
    retry: true,
    retryDelay: 5000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      store.dispatch(showNewSnackbar({ message: 'Added playlist to library!', type: 'success' }));
    },
  };
};

export const unsubscribeFromPlaylistMutationOptions = () => {
  const userId = store.getState().auth.user.id;
  return {
    queryKey: ['playlists', { is_subscribed: true }],
    mutationFn: (playlistId) => unsubscribeFromPlaylist(playlistId, userId),
    retry: true,
    retryDelay: 5000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      store.dispatch(
        showNewSnackbar({ message: 'Removed playlist from library!', type: 'success' })
      );
    },
  };
};

export const getRecentlyPlayedPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_recent: true }],
    queryFn: getRecentlyPlayedPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getPlaylistsByKeywordQueryOptions = (keyword) => {
  return queryOptions({
    queryKey: ['playlists', { keyword }],
    queryFn: () => getPlaylistsByKeyword(keyword),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!keyword,
  });
};
