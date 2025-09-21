import { queryOptions } from '@tanstack/react-query';
import { getArtists, getArtistById, getRelatedArtists } from '../services/artists';

export const getArtistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['artists'],
    queryFn: getArtists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getArtistByIdQueryOptions = (artistId) => {
  return queryOptions({
    queryKey: ['artists', { artistId }],
    queryFn: () => getArtistById(artistId),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!artistId,
  });
};

export const getRelatedArtistsQueryOptions = (artist) => {
  return queryOptions({
    queryKey: ['artists', { relation: artist.id }],
    queryFn: () => getRelatedArtists(artist),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!artist.id,
  });
};
