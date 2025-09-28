import { likeSong, unlikeSong } from '../services/likes';
import queryClient from '../queryClient';
import store from '../redux/store';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';

export const likeSongMutationOptions = () => {
  return {
    queryKey: ['songs'],
    mutationFn: ({ songId }) => likeSong(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      store.dispatch(showNewSnackbar({ message: 'Added to favorites!', type: 'success' }));
    },
  };
};

export const unlikeSongMutationOptions = () => {
  return {
    queryKey: ['songs'],
    mutationFn: ({ songId, userId }) => unlikeSong(songId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      store.dispatch(showNewSnackbar({ message: 'Removed from favorites!', type: 'success' }));
    },
  };
};
