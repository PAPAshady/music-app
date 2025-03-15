import { createContext, useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import PropTypes from 'prop-types';
import { addUser, getUser } from '../services/users';
import { getSession } from '../utils/storageUtils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(!!getSession());

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
        setIsLogin(true);
      } catch (err) {
        if (err.message === 'Auth session missing!') {
          console.warn('User is not registered');
        } else if (err.code === 'user_not_found') {
          console.warn('User not found');
        } else {
          console.error('An error occured while fetching user data => ', err.code);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  // add user to database if user signs up for the first time.
  const addUserToDatabase = async (user) => {
    try {
      const { id, email, user_metadata } = user;
      const { full_name, user_name, avatar_url } = user_metadata;
      const newUserData = {
        auth_id: id,
        email,
        full_name,
        user_name: user_name || email,
        avatar_url,
      };
      await addUser(newUserData);
    } catch (err) {
      console.error('An error occured while adding a new user to database => ', err);
    }
  };

  const signUp = async ({ email, password, user_name, first_name, last_name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_name, full_name: `${first_name} ${last_name}` } },
    });
    if (error) throw error;
    setUser(data.user);
    setIsLogin(true);
    await addUserToDatabase(data.user);
  };

  const signIn = async (formData) => {
    const { data, error } = await supabase.auth.signInWithPassword({ ...formData });
    if (error) throw error;
    setUser(data.user);
    setIsLogin(true);
  };

  //  there is a bug in this secition where when user logs in it will stay in auth page.
  const signInWithOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
    setIsLogin(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      const isUserExist = await getUser(user.id);
      if (!isUserExist) {
        await addUserToDatabase(user);
      }
    } catch (err) {
      console.error('An error occured while checking if user exists in database => ', err);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsLogin(false);
  };

  const authContextValues = {
    user,
    isLogin,
    isLoading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={authContextValues}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export default AuthContext;
