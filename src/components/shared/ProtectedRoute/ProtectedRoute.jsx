import useAuth from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
