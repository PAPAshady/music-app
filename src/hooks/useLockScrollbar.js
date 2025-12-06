import { useState, useCallback, useEffect } from 'react';

export default function useLockScrollbar(shouldLockPageScrollbar = false) {
  const [isScrollbarLocked, setIsScrollbarLocked] = useState(false);
  const lockScroll = useCallback(() => setIsScrollbarLocked(true), []);
  const unlockScroll = useCallback(() => setIsScrollbarLocked(false), []);

  // if shouldLockPageScrollbar is true, lock the page scrollbar as well
  useEffect(() => {
    if (isScrollbarLocked && shouldLockPageScrollbar) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = '8px';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = 0;
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = 0;
    };
  }, [isScrollbarLocked, shouldLockPageScrollbar]);

  return { isScrollbarLocked, lockScroll, unlockScroll };
}
