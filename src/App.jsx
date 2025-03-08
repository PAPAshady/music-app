import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import routes from './Router';
import './App.css';

const router = createBrowserRouter(routes);
const queryClinet = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClinet}>
      <HamburgerMenuProvider>
        <RouterProvider router={router} />
      </HamburgerMenuProvider>
    </QueryClientProvider>
  );
}

export default App;
