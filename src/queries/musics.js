import { queryOptions } from '@tanstack/react-query';
import { getAllSongs, getSongsByAlbumId } from '../services/songs';

export const getAllMusicsQueryOptions = () => {
  return queryOptions({
    queryKey: ['musics'],
    queryFn: getAllSongs,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getSongsByAlbumIdQueryOptions = (albumId) => {
  return queryOptions({
    queryKey: ['musics', { albumId }],
    queryFn: () => getSongsByAlbumId(albumId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
