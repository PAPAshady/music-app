import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { MusicPlayerProvider } from './MusicPlayerContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../redux/slices/authSlice';
import { addUser, getUser } from '../services/users';
import supabase from '../services/supabaseClient';
import { showNewSnackbar } from '../redux/slices/snackbarSlice';
import routes from '../Router';
import useInitilizeAudioEvents from '../hooks/useInitilizeAudioEvents';

const router = createBrowserRouter(routes);

export default function Providers() {
  const dispatch = useDispatch();
  useInitilizeAudioEvents(); // initilize all audio events globally.

  // initilize app's authentication
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        dispatch(setUser(null));
        dispatch(setLoading(false));
        return;
      }

      // keep user data up-to-date
      dispatch(setUser(session.user));

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

      dispatch(setLoading(false));
    });

    return () => authListener.subscription.unsubscribe();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <MusicPlayerProvider>
        <RouterProvider router={router} />
      </MusicPlayerProvider>
    </QueryClientProvider>
  );
}
