import { queryOptions } from '@tanstack/react-query';
import { getAllSongs } from '../services/songs';

export const getAllMusicsQueryOptions = () => {
  return queryOptions({
    queryKey: ['musics'],
    queryFn: getAllSongs,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
