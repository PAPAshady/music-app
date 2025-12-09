import { useEffect } from 'react';
import { setQueries } from '../redux/slices/queryStateSlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Syncs the Redux query state with the current URL search parameters.
// Whenever the URL changes (e.g. ?type=album&id=123), this hook extracts
// the updated query params and stores them in Redux so the UI can react accordingly.

export default function useUrlListener() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queries = Object.fromEntries(params.entries());
    dispatch(setQueries(queries));
  }, [location.search, dispatch]);
}
