import { likeSong, unlikeSong } from '../services/likes';
import queryClient from '../queryClient';
import store from '../redux/store';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';
import { setCurrentQueuelist } from '../redux/slices/playContextSlice';
import { setCurrentMusic } from '../redux/slices/musicPlayerSlice';

const onMutate = async (songId, shouldLike) => {
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

const onSuccess = (updatedSong) => {
  // sync redux store with server
  const currentQueuelist = store.getState().playContext.currentQueuelist;
  const updatedQueuelist = currentQueuelist.map((song) =>
    song.id === updatedSong.song_id ? { ...song, is_liked: !song.is_liked } : song
  );
  store.dispatch(setCurrentQueuelist(updatedQueuelist));

  const currentMusic = store.getState().musicPlayer.currentMusic;
  if (currentMusic?.id === updatedSong.song_id)
    store.dispatch(setCurrentMusic({ ...currentMusic, is_liked: !currentMusic.is_liked }));
};

const onError = (err, context, shouldLike) => {
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

export const likeSongMutationOptions = () => {
  return {
    queryKey: ['songs'],
    mutationFn: (songId) => likeSong(songId),
    onMutate: (updatedSong) => onMutate(updatedSong, true),
    onError: (err, _, context) => onError(err, context, true),
    onSuccess,
  };
};

export const unlikeSongMutationOptions = () => {
  const userId = store.getState().auth.user.id;
  return {
    queryKey: ['songs'],
    mutationFn: (songId) => unlikeSong(songId, userId),
    onMutate: (updatedSong) => onMutate(updatedSong, false),
    onError: (err, _, context) => onError(err, context, false),
    onSuccess,
  };
};
