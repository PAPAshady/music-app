import { queryOptions } from '@tanstack/react-query';
import {
  getAllAlbums,
  getAlbumsByArtistId,
  getAlbumById,
  getFavoriteAlbums,
  getTrendingAlbums,
  recommendAlbums,
  getRecentAlbums,
  getNewAlbums,
  getAlbumsByKeyword,
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

export const getAlbumsByArtistIdQueryOptions = (artistId, options) => {
  return queryOptions({
    queryKey: ['albums', { artistId }],
    queryFn: () => getAlbumsByArtistId(artistId, options),
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

export const getTrendingAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums', { is_trending: true }],
    queryFn: getTrendingAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};

export const getRecommendedAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums', { is_recommended: true }],
    queryFn: recommendAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};

export const getRecentAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums', { is_recent: true }],
    queryFn: getRecentAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};

export const getNewAlbumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums', { is_new: true }],
    queryFn: getNewAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });
};

export const getAlbumsByKeywordQueryOptions = (keyword, options) => {
  return queryOptions({
    queryKey: ['albums', { keyword }],
    queryFn: () => getAlbumsByKeyword(keyword, options),
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
    enabled: !!keyword,
  });
};
