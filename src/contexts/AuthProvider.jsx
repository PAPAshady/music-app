import supabase from '../services/supabaseClient';
import { createContext, useState, useEffect } from 'react';
import { addUser, getUser } from '../services/users';
import { useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { mutate } = useMutation({ mutationFn: addUser, onError: (err) => console.error(err) });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const { user } = session;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.clear();
      } else if (event === 'SIGNED_IN') {
        // Acoording to supabase.com docs, using an async callback with 'onAuthStateChange' can cause deadlocks and performance issues.
        // To avoid this, we use setTimeout. Reference: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
        setTimeout(async () => {
          const { email, id, user_metadata = {} } = user;
          const { avatar_url, user_name } = user_metadata;
          const isUserExists = await getUser(id);
          if (!isUserExists) {
            const newUserData = {
              auth_id: id,
              email,
              user_name: user_name ? user_name : email,
              avatar_url,
            };
            mutate(newUserData); // add new user to the database.
          }
        }, 0);
      }

      session && setUser(user);
    });

    return () => data.subscription.unsubscribe();
  }, [mutate]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
