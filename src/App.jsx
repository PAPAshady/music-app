import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
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
      <MusicPlayerProvider>
        <SnackbarProvider>
          <HamburgerMenuProvider>
            <RouterProvider router={router} />
          </HamburgerMenuProvider>
        </SnackbarProvider>
      </MusicPlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
