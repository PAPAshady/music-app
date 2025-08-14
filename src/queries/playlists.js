import { queryOptions } from '@tanstack/react-query';

export const getUserPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { isPrivate: true }],
    queryFn: () => {},
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
