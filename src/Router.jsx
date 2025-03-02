import { Navigate } from 'react-router-dom';
import MainLayout from './components/shared/Layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import AuthLayout from './components/shared/Layouts/AuthLayout/AuthLayout';
import SignIn from './pages/Auth/SignIn/SignIn';
import SignUp from './pages/Auth/SignUp/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import PlayLists from './pages/PlayLists/PlayLists';
import Browse from './pages/Browse/Browse';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import Permium from './pages/Permium/Permium';
import SettingsLayout from './components/shared/Layouts/SettingsLayout/SettingsLayout';
import Profile from './pages/Profile/Profile';
import Analytics from './pages/Auth/Analytics/Analytics';
import ContactUs from './pages/ContactUs/ContactUs';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/playlists', element: <PlayLists /> },
      { path: '/browse', element: <Browse /> },
      { path: '/permium', element: <Permium /> },
      {
        path: '/settings',
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/profile" replace /> },
          { path: 'profile', element: <Profile /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'contact-us', element: <ContactUs /> },
        ],
      },
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
