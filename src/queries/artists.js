import { queryOptions } from '@tanstack/react-query';
import { getArtists } from '../services/artists';

export const artistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['artists'],
    queryFn: getArtists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
