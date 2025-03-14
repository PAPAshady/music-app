import useAuth from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { isLogin, isLoading } = useAuth();

  if (!isLogin) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
