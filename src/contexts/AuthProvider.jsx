import supabase from '../services/supabaseClient';
import { createContext, useEffect } from 'react';
import { addUser, getUser } from '../services/users';
import { useMutation, useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { mutate } = useMutation({
    mutationFn: addUser,
    onError: (err) =>
      console.error('An error occured while creating a new user to database => ', err),
  });
  const { data: userData, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await supabase.auth.getUser(),
    retry: true,
    retryDelay: 3000,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.clear();
      } else if (event === 'SIGNED_IN') {
        if (session) {
          // Acoording to supabase.com docs, using an async callback with 'onAuthStateChange' can cause deadlocks and performance issues.
          // To avoid this, we use setTimeout. Reference: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
          setTimeout(async () => {
            try {
              const { user } = session;
              const { email, id, user_metadata = {} } = user;
              const { avatar_url, user_name } = user_metadata;
              const isUserExists = await getUser(id);
              if (!isUserExists) {
                const newUserData = {
                  auth_id: id,
                  email,
                  user_name: user_name || email,
                  avatar_url,
                };
                mutate(newUserData); // add new user to the database.
              }
            } catch (err) {
              console.log('An error occured while handling sign-in => ', err);
            }
          }, 0);
        }
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, [mutate, userData]);

  return (
    <AuthContext.Provider value={{ user: userData?.data?.user, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
