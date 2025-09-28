import { motion } from 'framer-motion';
import { glowHover } from '@/lib/motionPresets';

export default function GlowButton({ children, className = '', ...props }) {
  return (
    <motion.button
      {...glowHover}
      className={`relative rounded-md px-4 py-2 font-medium 
        bg-[--navy-800] text-[--ink] ring-1 ring-white/10 
        shadow-[0_0_24px_-6px_rgba(120,150,255,0.35)]
        hover:shadow-[0_0_28px_-6px_rgba(255,120,220,0.35)]
        transition-all ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -z-0 rounded-md bg-white/0 hover:bg-white/[0.02]" />
    </motion.button>
  );
}