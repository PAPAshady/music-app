import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver({
  onIntersect,
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
}) {
  const targetRef = useRef(null); // the element we’ll observe
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const elementRef = targetRef.current;
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && onIntersect) {
          onIntersect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) observer.unobserve(elementRef);
    };
  }, [root, rootMargin, threshold, onIntersect]);

  return { targetRef, isInView };
}
