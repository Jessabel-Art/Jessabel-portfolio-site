// src/components/ScrollAndHash.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollAndHash() {
  const { pathname, hash } = useLocation();

  // reset scroll on path change (no hash)
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  // scroll to element if hash exists
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return null;
}
