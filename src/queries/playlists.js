import { queryOptions } from '@tanstack/react-query';
import { getAllPlaylists } from '../services/playlists';

export const getAllPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists'],
    queryFn: getAllPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getUserPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { isPrivate: true }],
    queryFn: () => {},
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
