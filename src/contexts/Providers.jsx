import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './HamburgerMenuContext';
import { SnackbarProvider } from './SnackbarContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MusicPlayerProvider } from './MusicPlayerContext';
import { AuthContextProvider } from './AuthContext';
import { MobilePlaylistProvider } from './MobilePlaylistContext';
import { PlaylistInfosModalProvider } from './PlaylistInfosModalContext';
import routes from '../Router';

const router = createBrowserRouter(routes);
const queryClinet = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers() {
  return (
    <QueryClientProvider client={queryClinet}>
      <SnackbarProvider>
        <AuthContextProvider>
          <MusicPlayerProvider>
            <MobilePlaylistProvider>
              <HamburgerMenuProvider>
                <PlaylistInfosModalProvider>
                  <RouterProvider router={router} />
                </PlaylistInfosModalProvider>
              </HamburgerMenuProvider>
            </MobilePlaylistProvider>
          </MusicPlayerProvider>
        </AuthContextProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
