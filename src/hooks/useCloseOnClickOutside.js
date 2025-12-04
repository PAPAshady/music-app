import { useState, useEffect, useRef } from 'react';

// close drop downs when user clicks outside.
export default function useCloseOnClickOutside(initialState = false, onClose) {
  const [isVisible, setIsVisible] = useState(initialState);
  const refs = useRef([]);

  const setRef = (el) => {
    // avoid duplicate and null refs
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideAll = refs.current.every((ref) => !ref.contains(event.target));
      if (clickedOutsideAll) {
        setIsVisible(false);
        onClose?.();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, onClose]);

  return { refs, isVisible, setIsVisible, setRef };
}
