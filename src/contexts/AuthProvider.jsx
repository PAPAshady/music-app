import { createContext, useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import PropTypes from 'prop-types';
import { addUser, getUser, getUserAvatarUrl } from '../services/users';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const userAvatar = await getUserAvatarUrl(user.id);
      setAvatar(userAvatar);
    };

    user && fetchUserAvatar();
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // keep user data up-to-date
      setUser(session.user);

      if (event === 'SIGNED_IN') {
        // using setTimeout is necessary to avoid dead-locks and performance issues.
        // refrence : https://supabase.com/docs/reference/javascript/auth-onauthstatechange
        setTimeout(async () => {
          // add user to database if they sign up for the first time
          const isUserExists = await getUser(session.user.id);
          if (!isUserExists) {
            try {
              const { id, email, user_metadata } = session.user;
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
              dispatch(
                showNewSnackbar({
                  message: 'An error occured while adding a new user to database',
                  type: 'error',
                })
              );
              console.error('An error occured while adding a new user to database => ', err);
            }
          }
        }, 0);
      }

      setIsLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, [dispatch]);

  const signUp = async ({ email, password, user_name, first_name, last_name }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_name, full_name: `${first_name} ${last_name}` } },
    });
    if (error) throw error;
  };

  const signIn = async (formData) => {
    const { error } = await supabase.auth.signInWithPassword({ ...formData });
    if (error) throw error;
  };

  const signInWithOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const authContextValues = {
    user,
    avatar,
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
