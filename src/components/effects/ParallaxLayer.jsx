import React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function ParallaxLayer({ speed = 0.1, className = '', children }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -800 * speed]);
  return (
    <motion.div style={{ y }} className={className} aria-hidden="true">
      {children}
    </motion.div>
  );
}
