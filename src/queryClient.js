import { QueryClient } from '@tanstack/react-query';

const queryClinet = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClinet;
