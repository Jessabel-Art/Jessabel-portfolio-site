import React from 'react';
import { motion } from 'framer-motion';

/**
 * Place behind Hero content. Layered, semi-transparent “flows”.
 */
export default function LayeredBackdrop({ className = '' }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true">
      {/* base radial to anchor the eye */}
      <div className="absolute -inset-20 opacity-70"
           style={{ background: 'radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0))' }} />
      {/* flowing blobs */}
      <motion.div
        className="absolute -top-1/3 -right-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-40"
        style={{ background: 'conic-gradient(from 20deg, #ff3ea5, #ffd166, #7aa2ff, #ff3ea5)' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-1/3 -left-1/4 w-[55vw] h-[55vw] rounded-full blur-3xl opacity-35"
        style={{ background: 'conic-gradient(from -60deg, #7aa2ff, #b794f4, #ff3ea5, #7aa2ff)' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 75, ease: 'linear', repeat: Infinity }}
      />
      {/* fine grain to avoid banding */}
      <div className="absolute inset-0 opacity-[0.08]"
           style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27><circle cx=%271%27 cy=%271%27 r=%271%27 fill=%27white%27 opacity=%270.3%27/></svg>")' }} />
    </div>
  );
}
