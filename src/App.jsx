import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { AuthContextProvider } from './contexts/AuthContext';
import { MobilePlaylistProvider } from './contexts/MobilePlaylistContext';
import { PlaylistInfosModalProvider } from './contexts/PlaylistInfosModalContext';
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

export default App;
