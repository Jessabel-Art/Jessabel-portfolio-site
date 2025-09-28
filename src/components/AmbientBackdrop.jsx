import { useEffect, useRef } from 'react';

/** Ambient neon gradients. Sits fixed behind content (-z-10). */
export default function AmbientBackdrop({ intensity = 'low' }) {
  const ref = useRef(null);
  useEffect(() => {}, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10
      bg-[radial-gradient(60%_40%_at_50%_0%,rgba(90,120,255,0.20),transparent),radial-gradient(40%_30%_at_10%_90%,rgba(255,80,180,0.12),transparent)]
      ${intensity === 'low' ? 'opacity-60' : 'opacity-90'}`}
    />
  );
}