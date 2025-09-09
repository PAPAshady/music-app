import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// activate react-query devtools
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export default queryClient;
