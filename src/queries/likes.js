import { likeSong, unlikeSong } from '../services/likes';
import queryClient from '../queryClient';

export const likeSongMutationOptions = (songId, onSuccess) => {
  return {
    queryKey: ['songs', { isLiked: true }],
    mutationFn: () => likeSong(songId),
    onSuccess: () => {
      queryClient.setQueryData(['songs', { isLiked: true }], (songs) => {
        return songs.map((song) => (song.id === songId ? { ...song, is_liked: true } : song));
      });
      onSuccess?.();
    },
  };
};

export const unlikeSongMutationOptions = (songId, userId, onSuccess) => {
  return {
    queryKey: ['songs', { isLiked: true }],
    mutationFn: () => unlikeSong(songId, userId),
    onSuccess: () => {
      queryClient.setQueryData(['songs', { isLiked: true }], (songs) => {
        return songs.map((song) => (song.id === songId ? { ...song, is_liked: false } : song));
      });
      onSuccess?.();
    },
  };
};
