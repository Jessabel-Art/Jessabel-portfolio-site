// Reusable Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, amount: 0.3 }
};

export const glowHover = {
  whileHover: { scale: 1.02, filter: 'brightness(1.08)' },
  transition: { type: 'spring', stiffness: 320, damping: 18 }
};

export const staggerChildren = (delay = 0.06) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: delay } }
});

export const childFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};