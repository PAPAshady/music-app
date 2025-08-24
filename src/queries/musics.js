import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { getAllSongs, getSongsByAlbumId, getSongsByPlaylistId } from '../services/songs';

export const getAllSongsInfiniteQueryOptions = ({ limit = 10 } = {}) => {
  return infiniteQueryOptions({
    queryKey: ['songs'],
    queryFn: ({ pageParam }) => getAllSongs({ limit, cursor: pageParam }),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < limit) return undefined; // no more data

      // cursor = created_at of the last song in this batch
      return lastPage[lastPage.length - 1].created_at;
    },
  });
};

export const getSongsByAlbumIdQueryOptions = (albumId) => {
  return queryOptions({
    queryKey: ['albums', { albumId }],
    queryFn: () => getSongsByAlbumId(albumId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!albumId,
  });
};

export const getSongsByPlaylistIdQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { playlistId }],
    queryFn: () => getSongsByPlaylistId(playlistId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!playlistId,
  });
};
