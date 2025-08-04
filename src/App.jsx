import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import routes from './Router';
import { useEffect } from 'react';
import supabase from './services/supabaseClient';
import { getUser, addUser } from './services/users';
import { showNewSnackbar } from './redux/slices/snackbarSlice';
import { setUser, setLoading } from './redux/slices/authSlice';
import './App.css';

const router = createBrowserRouter(routes);
const queryClinet = new QueryClient();

function App() {
  const dispatch = useDispatch();

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
    <QueryClientProvider client={queryClinet}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
