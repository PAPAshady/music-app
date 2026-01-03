import supabase from '../services/supabaseClient';
import { setUser } from '../redux/slices/authSlice';
import { hideLoadingOverlay } from '../redux/slices/loadingOverLaySlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import queryClient from '../queryClient';

export default function useInitilizeAuth() {
  const dispatch = useDispatch();

  // initilize app's authentication
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        dispatch(setUser(null));
        dispatch(hideLoadingOverlay());
        return;
      }

      // keep user data up-to-date
      dispatch(setUser(session.user));

      // We refetch here because the user's auth state just changed, so all user-dependent
      // data must be refreshed to stay consistent with the new session.
      queryClient.invalidateQueries({ refetchType: 'all' });

      dispatch(hideLoadingOverlay());
    });

    return () => authListener.subscription.unsubscribe();
  }, [dispatch]);
}
