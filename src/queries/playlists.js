import { queryOptions } from '@tanstack/react-query';
import { getUserPlaylists } from '../services/playlists';

export const getUserPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { isPrivate: true }],
    queryFn: getUserPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
