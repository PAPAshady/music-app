import { queryOptions } from '@tanstack/react-query';
import { getAllMusics } from '../services/musics';

export const getAllMusicsQueryOptions = () => {
  return queryOptions({
    queryKey: ['musics'],
    queryFn: getAllMusics,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
