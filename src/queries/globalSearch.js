import { queryOptions } from '@tanstack/react-query';
import { globalSearch } from '../services/globalSearch';

export const globalSearchQueryOptions = (query, filter = 'all') => {
  return queryOptions({
    queryKey: ['search', { query, filter }],
    queryFn: () => globalSearch(query, filter),
    retry: true,
    retryDelay: 5000,
    enabled: !!query?.trim(),
  });
};
