import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import api, { BASE_URL } from '../services/api';
import { setAccessToken, setRefreshToken } from '../utils/storageUtils';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const register = async (userData) => {
    const {
      data: { data },
    } = await api.post(`${BASE_URL}/api/auth/register/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setUser(data);
    setIsLoggedIn(true);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
  };

  const login = async (userData) => {
    const {
      data: { data },
    } = await api.post(`${BASE_URL}/api/auth/login/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setUser(data);
    setIsLoggedIn(true);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = { children: PropTypes.node.isRequired };
export default AuthContext;
