import { queryOptions } from '@tanstack/react-query';
import { getUserTopGenres } from '../services/genres';

export const getUserTopGenresQueryOptions = () => {
  return queryOptions({
    queryKey: ['genres', { is_top: true }],
    queryFn: getUserTopGenres,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,   
  });
};
