import { queryOptions } from '@tanstack/react-query';
import { getAllAlbums } from '../services/albums';

export const albumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums'],
    queryFn: getAllAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};
