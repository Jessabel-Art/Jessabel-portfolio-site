// src/hooks/use-media-query.js
import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const getMatch = () =>
    typeof window !== "undefined" && "matchMedia" in window
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Modern + fallback
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    // Initialize on mount
    setMatches(mql.matches);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [query]);

  return matches;
}
