import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useMediaQuery from '../../../hooks/useMediaQuery';
import Logo from '../../Logo/Logo';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isLoading) {
    return (
      <div className="relative">
        <div
          className={`fixed inset-0 z-20 grid h-[100dvh] w-full place-content-center backdrop-blur-md transition-all duration-300`}
        >
          <Logo size={isDesktop ? 'xl' : 'lg'} isLoading />
        </div>
        {children}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
