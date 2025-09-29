import { likeSong, unlikeSong } from '../services/likes';
import queryClient from '../queryClient';
import store from '../redux/store';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';

const onMutate = async (updatedSong, shouldLike) => {
  // do optimistic updates on songs to have a realtime updates in UI
  await queryClient.cancelQueries({ queryKey: ['songs'] });
  const prevSongs = queryClient.getQueriesData({ queryKey: ['songs'] });
  queryClient.setQueriesData({ queryKey: ['songs'] }, (oldData) => {
    if (!oldData) return oldData;
    if (oldData.pages) {
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((song) =>
            song.id === updatedSong.songId ? { ...song, is_liked: !song.is_liked } : song
          )
        ),
      };
    }

    return oldData.map((song) =>
      song.id === updatedSong.songId ? { ...song, is_liked: !song.is_liked } : song
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
    mutationFn: ({ songId }) => likeSong(songId),
    onMutate: (updatedSong) => onMutate(updatedSong, true),
    onError: (err, _, context) => onError(err, context, true),
  };
};

export const unlikeSongMutationOptions = () => {
  return {
    queryKey: ['songs'],
    mutationFn: ({ songId, userId }) => unlikeSong(songId, userId),
    onMutate: (updatedSong) => onMutate(updatedSong, false),
    onError: (err, _, context) => onError(err, context, false),
  };
};
