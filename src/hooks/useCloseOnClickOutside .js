import { useState, useEffect, useRef } from 'react';

// close drop downs when user clicks outside.
export default function useCloseOnClickOutside(initialState = false, onClose) {
  const [isVisible, setIsVisible] = useState(initialState);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
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

  return { ref, isVisible, setIsVisible };
}
