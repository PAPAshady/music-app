import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import {
  getAllSongs,
  getSongById,
  getSongsByAlbumId,
  getSongsByPlaylistId,
  getPopularSongsByArtistId,
  getRelatedSongsBySongData,
  getFavoriteSongs,
} from '../services/songs';

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

export const getSongByIdQueryOptions = (songId) => {
  return queryOptions({
    queryKey: ['songs', { songId }],
    queryFn: () => getSongById(songId),
    staleTime: Infinity,
    enabled: !!songId,
  });
};

export const getPopularSongsByArtistIdQueryOptions = (artistId) => {
  return queryOptions({
    queryKey: ['songs', { artistId }],
    queryFn: () => getPopularSongsByArtistId(artistId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!artistId,
  });
};

export const getSongsByAlbumIdQueryOptions = (albumId) => {
  return queryOptions({
    queryKey: ['songs', { albumId }],
    queryFn: () => getSongsByAlbumId(albumId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!albumId,
  });
};

export const getSongsByPlaylistIdQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['songs', { playlistId }],
    queryFn: () => getSongsByPlaylistId(playlistId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!playlistId,
  });
};

export const getRelatedSongsBySongDataQueryOptions = (song) => {
  return queryOptions({
    queryKey: ['songs', { relation: song?.id }],
    queryFn: () => getRelatedSongsBySongData(song),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!song?.id,
  });
};

export const getFavoriteSongsQueryOptions = () => {
  return queryOptions({
    queryKey: ['songs', { is_liked: true }],
    queryFn: getFavoriteSongs,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};
