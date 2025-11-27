import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute';
import MainLayout from './components/shared/Layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import AuthLayout from './components/shared/Layouts/AuthLayout/AuthLayout';
import SignIn from './pages/Auth/SignIn/SignIn';
import SignUp from './pages/Auth/SignUp/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import PlayLists from './pages/PlayLists/PlayLists';
import Browse from './pages/Browse/Browse';
import Permium from './pages/Permium/Permium';
import SettingsLayout from './components/shared/Layouts/SettingsLayout/SettingsLayout';
import Profile from './pages/Profile/Profile';
import Analytics from './pages/Analytics/Analytics';
import ContactUs from './pages/ContactUs/ContactUs';
import FAQ from './pages/FAQ/FAQ';
import NotFoundPage from './pages/404/404';
import homePageBg from './assets/images/backgrounds/home-page.jpg';
import favoritesPageBg from './assets/images/backgrounds/favorites-page.jpg';
import playlistAndSubscriptionPageBgImg from './assets/images/backgrounds/playlist and-subscription-page.jpg';
import browsePageBgImg from './assets/images/backgrounds/browse-page.jpg';
import settingsPageBgImg from './assets/images/backgrounds/player-and-settings-page.png';

const routes = [
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <NotFoundPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',

    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Home />, handle: { backgroundCover: homePageBg } },
      { path: '/favorites', element: <Favorites />, handle: { backgroundCover: favoritesPageBg } },
      {
        path: '/playlists',
        element: <PlayLists />,
        handle: { backgroundCover: playlistAndSubscriptionPageBgImg },
      },
      { path: '/browse', element: <Browse />, handle: { backgroundCover: browsePageBgImg } },
      {
        path: '/permium',
        element: <Permium />,
        handle: { backgroundCover: playlistAndSubscriptionPageBgImg },
      },
      {
        path: '/settings',
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/profile" replace /> },
          { path: 'profile', element: <Profile /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'contact-us', element: <ContactUs /> },
          { path: 'FAQ', element: <FAQ /> },
        ],
        handle: { backgroundCover: settingsPageBgImg },
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/sign-up" replace /> },
      { path: 'sign-in', element: <SignIn /> },
      { path: 'forgot-pass', element: <ForgotPassword /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'reset-pass', element: <ResetPassword /> },
    ],
  },
];

export default routes;
