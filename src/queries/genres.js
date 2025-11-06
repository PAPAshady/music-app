import { queryOptions } from '@tanstack/react-query';
import { getAllGenres, getUserTopGenres } from '../services/genres';

export const getAllGenresQueryOptions = () => {
  return queryOptions({
    queryKey: ['genres'],
    queryFn: getAllGenres,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getUserTopGenresQueryOptions = () => {
  return queryOptions({
    queryKey: ['genres', { is_top: true }],
    queryFn: getUserTopGenres,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
