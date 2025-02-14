import { Navigate } from 'react-router-dom';
import Layout from './components/shared/Layout/Layout';
import Home from './pages/Home/Home';
import AuthLayout from './pages/Auth/AuthLayout';
import SignIn from './pages/Auth/pages/SignIn/SignIn';
import SignUp from './pages/Auth/pages/SignUp/SignUp';

const routes = [
  { path: '/', element: <Layout />, children: [{ path: '/', element: <Home /> }] },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/sign-in" replace /> },
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
    ],
  },
];

export default routes;
