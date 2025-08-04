import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
