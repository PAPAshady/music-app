import { Navigate } from 'react-router-dom';
import Layout from './components/shared/Layout/Layout';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import AuthLayout from './pages/Auth/AuthLayout';
import SignIn from './pages/Auth/pages/SignIn/SignIn';
import SignUp from './pages/Auth/pages/SignUp/SignUp';
import ForgotPassword from './pages/Auth/pages/ForgotPassword/ForgotPassword';
import PlayLists from './pages/PlayLists/PlayLists';
import Browse from './pages/Browse/Browse';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import Permium from './pages/Permium/Permium';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/playlists', element: <PlayLists /> },
      { path: '/browse', element: <Browse /> },
      { path: '/permium', element: <Permium /> },
    ],
  },
  { path: '/player', element: <PlayerPage /> },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/sign-in" replace /> },
      {
        path: 'sign-in',
        element: <SignIn />,
        children: [{ path: 'forgot-pass', element: <ForgotPassword /> }],
      },
      { path: 'sign-up', element: <SignUp /> },
    ],
  },
];

export default routes;
