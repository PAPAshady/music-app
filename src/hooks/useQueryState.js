import { useSearchParams } from 'react-router-dom';

function useQueryState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setQuery = (key, value = '') => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const removeQuery = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const getQuery = (key) => {
    return searchParams.get(key);
  };

  return { setQuery, removeQuery, getQuery };
}

export default useQueryState;
