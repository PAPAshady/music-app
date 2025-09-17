import { queryOptions } from '@tanstack/react-query';
import { getArtists, getArtistById, getRelatedArtistsByGenres } from '../services/artists';

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

export const getRelatedArtistsByGenresQueryOptions = (genres) => {
  return queryOptions({
    queryKey: ['artists', { genres }],
    queryFn: () => getRelatedArtistsByGenres(genres),
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
    enabled: !!genres?.length,
  });
};
