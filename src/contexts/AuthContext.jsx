import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api, { BASE_URL } from '../services/api';
import useSnackbar from '../hooks/useSnackbar';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const { showNewSnackbar } = useSnackbar();

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      try {
        const res = await getMe();
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
    };
    getUserData();
  }, [isLoggedIn]);

  async function getMe() {
    const res = await api.get(`${BASE_URL}/api/auth/getme/`);
    return res;
  }

  const register = async (userData) => {
    const { status } = await api.post(`${BASE_URL}/api/auth/register/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    status === 201 && setIsLoggedIn(true);
  };

  const login = async (userData) => {
    const { status } = await api.post(`${BASE_URL}/api/auth/login/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    status === 200 && setIsLoggedIn(true);
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
