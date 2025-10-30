import { queryOptions } from '@tanstack/react-query';
import {
  getAllAlbums,
  getAlbumsByArtistId,
  getAlbumById,
  getFavoriteAlbums,
} from '../services/albums';

export const getAllAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums'],
    queryFn: getAllAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};

export const getAlbumByIdQueryOptions = (albumId) => {
  return queryOptions({
    queryKey: ['albums', { albumId }],
    queryFn: () => getAlbumById(albumId),
    staleTime: Infinity,
    enabled: !!albumId,
  });
};

export const getAlbumsByArtistIdQueryOptions = (artistId) => {
  return queryOptions({
    queryKey: ['albums', { artistId }],
    queryFn: () => getAlbumsByArtistId(artistId),
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
    enabled: !!artistId,
  });
};

export const getFavoriteAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums', { is_liked: true }],
    queryFn: getFavoriteAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};
