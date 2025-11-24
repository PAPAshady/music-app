import { queryOptions } from '@tanstack/react-query';
import { getAllGenres, getUserTopGenres, getGenreById } from '../services/genres';

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

export const getGenreByIdQueryOptions = (genreId) => {
  return queryOptions({
    queryKey: ['genres', { genreId }],
    queryFn: () => getGenreById(genreId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!genreId,
  });
};
