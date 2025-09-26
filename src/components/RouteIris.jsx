import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RouteIris() {
  const [burst, setBurst] = useState(null); // { x, y, id }
  const timeoutRef = useRef();

  useEffect(() => {
    const onStart = (e) => {
      // e.detail: { x, y } in viewport coords
      const { x, y } = e.detail || {};
      // give each burst a unique key
      setBurst({ x, y, id: Math.random().toString(36).slice(2) });
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setBurst(null), 700);
    };
    window.addEventListener("start-iris", onStart);
    return () => {
      window.removeEventListener("start-iris", onStart);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {burst && (
        <motion.div
          key={burst.id}
          initial={{ clipPath: `circle(0px at ${burst.x}px ${burst.y}px)`, opacity: 1 }}
          animate={{ clipPath: `circle(160vmax at ${burst.x}px ${burst.y}px)`, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            pointerEvents: "none",
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(0,255,255,0.25), rgba(0,255,255,0.12) 30%, rgba(0,0,0,0) 65%), rgba(0, 24, 32, 0.45)",
            boxShadow: "inset 0 0 120px rgba(0,255,255,0.25)",
            backdropFilter: "blur(2px) saturate(1.1)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
