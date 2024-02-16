import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ selector }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.querySelector(selector);
    el?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}
