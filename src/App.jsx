import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { AuthContextProvider } from './contexts/AuthContext';
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
      <AuthContextProvider>
        <MusicPlayerProvider>
          <SnackbarProvider>
            <HamburgerMenuProvider>
              <RouterProvider router={router} />
            </HamburgerMenuProvider>
          </SnackbarProvider>
        </MusicPlayerProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
