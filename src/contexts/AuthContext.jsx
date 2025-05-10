import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api, { BASE_URL } from '../services/api';
import SnackbarContext from './SnackbarContext';
import useSafeContext from '../hooks/useSafeContext';

const AuthContext = createContext();
AuthContext._providerName = 'AuthContextProvider';
AuthContext._hookName = 'useAuth';

export function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const { showNewSnackbar } = useSafeContext(SnackbarContext);

  const getMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`${BASE_URL}/api/auth/getme/`);
      if (res.status === 200) {
        const { data: user } = res;
        setUser(user.data);
        setIsLoading(false);
        setIsLoggedIn(true);
      }
    } catch (err) {
      if (err.status === 401) {
        // user must login/register. user will be re-directed to signin/signup page using protected route
        setIsLoading(false);
      } else if (err.code === 'ERR_NETWORK') {
        showNewSnackbar(
          'Network error. Please check your connection and try again.',
          'error',
          4000
        );
      } else {
        showNewSnackbar('Error while getting user data. Please try again later.', 'error');
        console.log(err);
      }
    }
  }, [showNewSnackbar]);

  useEffect(() => {
    getMe();
  }, [getMe]);

  const register = async (userData) => {
    const { status } = await api.post(`${BASE_URL}/api/auth/register/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    status === 201 && getMe();
  };

  const login = async (userData) => {
    const { status } = await api.post(`${BASE_URL}/api/auth/login/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    status === 200 && getMe();
  };

  const logOut = async () => {
    const res = await api.post(`${BASE_URL}/api/auth/logout/`);
    if (res.status === 204) {
      setIsLoggedIn(false);
      setUser({});
      showNewSnackbar('You have been logged out successfully.', 'success');
    }else {
      showNewSnackbar('Error while logging out. Please try again later.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        register,
        login,
        logOut,
        getMe,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = { children: PropTypes.node.isRequired };
export default AuthContext;
