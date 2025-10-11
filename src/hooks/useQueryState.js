import { useSearchParams } from 'react-router-dom';

function useQueryState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ set one or multiple query params
  const setQuery = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (typeof key === 'object') {
      // If an object is passed → set multiple keys
      Object.entries(key).forEach(([key, value]) => {
        params.set(key, value);
      });
    } else {
      // Otherwise, set a single key
      params.set(key, value);
    }

    setSearchParams(params);
  };

  const removeQuery = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  const getQuery = (key) => {
    return searchParams.get(key);
  };

  return { setQuery, removeQuery, getQuery };
}

export default useQueryState;
