import { createContext, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const {
    data: userData,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await supabase.auth.getUser(),
    retry: true,
    retryDelay: 3000,
    initialData: null,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isError) {
      console.log('An error occured while getting data from server => ', error);
    }
  }, [isError, error]);

  const signUp = async ({ email, password, userـname }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { userـname } },
    });
    if (error) throw error;
    await refetch();
    return data;
  };

  const signIn = async (formData) => {
    const { data, error } = await supabase.auth.signInWithPassword({ ...formData });
    if (error) throw error;
    await refetch();
    return data;
  };

  const signInWithOAuth = async (provider) => {
    const { error, data } = supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const authContextValues = {
    user: userData?.data?.user,
    isLoading: isFetching,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={authContextValues}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export default AuthContext;
