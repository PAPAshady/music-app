import { queryOptions } from '@tanstack/react-query';
import { getAllSongs, getSongsByTracklistId } from '../services/songs';

export const getAllMusicsQueryOptions = () => {
  return queryOptions({
    queryKey: ['musics'],
    queryFn: getAllSongs,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getSongsByTracklistIdQueryOptions = (tracklistId, tracklistType) => {
  return queryOptions({
    queryKey: ['tracklists', { tracklistId }],
    queryFn: () => getSongsByTracklistId(tracklistId, tracklistType),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
