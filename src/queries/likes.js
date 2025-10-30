import { likeSong, unlikeSong, likePlaylist, unlikePlaylist } from '../services/likes';
import queryClient from '../queryClient';
import store from '../redux/store';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';
import { setCurrentQueuelist } from '../redux/slices/playContextSlice';
import { setCurrentMusic } from '../redux/slices/musicPlayerSlice';

const onSongMutate = async (songId, shouldLike) => {
  // do optimistic updates on songs to have a realtime updates in UI
  await queryClient.cancelQueries({ queryKey: ['songs'] });
  const prevSongs = queryClient.getQueriesData({ queryKey: ['songs'] });
  queryClient.setQueriesData({ queryKey: ['songs'] }, (oldData) => {
    if (!oldData) return oldData;

    // if data is paginated
    if (oldData.pages) {
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((song) => (song.id === songId ? { ...song, is_liked: !song.is_liked } : song))
        ),
      };
    }

    // if data is a single song
    if (oldData.constructor === Object) {
      if (songId === oldData.id) return { ...oldData, is_liked: !oldData.is_liked };
      return oldData;
    }

    // if data is an array
    return oldData.map((song) =>
      song.id === songId ? { ...song, is_liked: !song.is_liked } : song
    );
  });
  store.dispatch(
    showNewSnackbar({
      message: `${shouldLike ? 'Added to' : 'Removed from'} favorites!`,
      type: 'success',
    })
  );
  return { prevSongs };
};

const onSongSuccess = (updatedSong) => {
  queryClient.invalidateQueries({ queryKey: ['songs', { is_liked: true }] });
  // sync redux store with server
  const currentQueuelist = store.getState().playContext.currentQueuelist;
  const updatedQueuelist = currentQueuelist.map((song) =>
    song.id === updatedSong.target_id ? { ...song, is_liked: !song.is_liked } : song
  );
  store.dispatch(setCurrentQueuelist(updatedQueuelist));

  const currentMusic = store.getState().musicPlayer.currentMusic;
  if (currentMusic?.id === updatedSong.target_id)
    store.dispatch(setCurrentMusic({ ...currentMusic, is_liked: !currentMusic.is_liked }));
};

const onSongError = (err, context, shouldLike) => {
  // revert back the changes in case of an error
  context.prevSongs.forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
  store.dispatch(
    showNewSnackbar({
      message: `Error while ${shouldLike ? 'adding' : 'removing'} song ${shouldLike ? 'to' : 'from'} favorites. Try again`,
      type: 'error',
    })
  );
  console.error(`Error ${shouldLike ? 'liking' : 'unliking'} song : `, err);
};

const onPlaylistMutate = async (updatedPlaylistId, shouldLike) => {
  await queryClient.cancelQueries({ queryKey: ['playlists'] });
  const prevPlaylists = queryClient.getQueriesData({ queryKey: ['playlists'] });
  queryClient.setQueriesData({ queryKey: ['playlists'] }, (prevPlaylists) => {
    if (!prevPlaylists) return prevPlaylists;
    return prevPlaylists.map((playlist) => {
      if (playlist.id === updatedPlaylistId) {
        return { ...playlist, is_liked: shouldLike };
      }
      return playlist;
    });
  });
  return { prevPlaylists };
};

const onPlaylistError = (err, context, shouldLike) => {
  console.error(`Error ${shouldLike ? 'liking' : 'unliking'} playlist : `, err);
  // revert back the changes in case of an error
  context.prevPlaylists.forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
  store.dispatch(
    showNewSnackbar({
      message: `Error while ${shouldLike ? 'adding' : 'removing'} playlist ${shouldLike ? 'to' : 'from'} favorites. Try again`,
      type: 'error',
    })
  );
};

const onPlaylistSuccess = (shouldLike) => {
  store.dispatch(
    showNewSnackbar({
      message: `${shouldLike ? 'Added to' : 'Removed from'} favorites!`,
      type: 'success',
    })
  );
  queryClient.invalidateQueries({ queryKey: ['playlists', { is_liked: true }] });
};

export const likeSongMutationOptions = () => {
  return {
    queryKey: ['songs'],
    mutationFn: (songId) => likeSong(songId),
    onMutate: (updatedSong) => onSongMutate(updatedSong, true),
    onError: (err, _, context) => onSongError(err, context, true),
    onSuccess: (updatedSong) => onSongSuccess(updatedSong),
  };
};

export const unlikeSongMutationOptions = () => {
  const userId = store.getState().auth.user.id;
  return {
    queryKey: ['songs'],
    mutationFn: (songId) => unlikeSong(songId, userId),
    onMutate: (updatedSong) => onSongMutate(updatedSong, false),
    onError: (err, _, context) => onSongError(err, context, false),
    onSuccess: (updatedSong) => onSongSuccess(updatedSong),
  };
};

export const likePlaylistMutationOptions = () => {
  return {
    queryKey: ['playlists'],
    mutationFn: (playlistId) => likePlaylist(playlistId),
    onMutate: (target_id) => onPlaylistMutate(target_id, true),
    onError: (err, _, context) => onPlaylistError(err, context, true),
    onSuccess: () => onPlaylistSuccess(false),
  };
};

export const unlikePlaylistMutationOptions = () => {
  const userId = store.getState().auth.user.id;
  return {
    queryKey: ['playlists'],
    mutationFn: (playlistId) => unlikePlaylist(playlistId, userId),
    onMutate: (target_id) => onPlaylistMutate(target_id, false),
    onError: (err, _, context) => onPlaylistError(err, context, false),
    onSuccess: () => onPlaylistSuccess(true),
  };
};
