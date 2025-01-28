import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HamburgerMenuProvider } from './contexts/HamburgerMenuContext';
import routes from './Router';
import './App.css';

function App() {
  const router = createBrowserRouter(routes);
  return (
    <HamburgerMenuProvider>
      <RouterProvider router={router} />
    </HamburgerMenuProvider>
  );
}

export default App;
