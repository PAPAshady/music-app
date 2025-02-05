import { useState, useEffect } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const updateMatches = (e) => setMatches(e.matches);

    mediaQueryList.addEventListener('change', updateMatches);

    return () => mediaQueryList.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}
