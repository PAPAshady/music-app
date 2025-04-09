import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import routes from './Router';
import './App.css';

const router = createBrowserRouter(routes);
const queryClinet = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClinet}>
      <SnackbarProvider>
        <HamburgerMenuProvider>
          <RouterProvider router={router} />
        </HamburgerMenuProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
