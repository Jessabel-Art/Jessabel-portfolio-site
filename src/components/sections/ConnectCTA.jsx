// src/components/sections/ConnectCTA.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

// 🔧 tweak this to darken/lighten the image behind the CTA
const BG_DARKEN = 1;

const container = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Import the background image from src/images
import ctaBg from '@/assets/images/connectCTA-bg.png';

export default function ConnectCTA() {
  return (
    <section id="connect-cta" className="relative py-20 md:py-28 overflow-hidden">
      {/* lowest layer: ambient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-16 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      {/* full-section background image ABOVE ambient, BELOW content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <img src={ctaBg} alt="" className="w-full h-full object-cover" draggable="false" />
        {BG_DARKEN > 0 && (
          <div
            className="absolute inset-0"
            style={{
              opacity: BG_DARKEN,
              background:
                'linear-gradient(180deg, rgba(7,13,29,0.75) 0%, rgba(7,13,29,0.25) 35%, rgba(7,13,29,0.7) 100%)',
            }}
          />
        )}
      </div>

      {/* content sits on top */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={item} className="text-3xl md:text-4xl font-semibold tracking-tight">
            Let’s build something users{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400">
              love
            </span>.
          </motion.h2>

          <motion.p variants={item} className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-foreground/70">
            Available for product design, UX strategy, and front-end partnerships. Freelance, contract, or in-house.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col items-center justify-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm md:text-base font-medium
                         text-white shadow-[0_8px_30px_rgba(124,77,255,.35)]
                         bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500
                         hover:from-cyan-300 hover:via-sky-400 hover:to-violet-400
                         transition-all duration-300"
              aria-label="Start a project"
            >
              <Rocket className="h-4 w-4" />
              <span>Start a Project</span>
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(120px_60px_at_var(--x,50%)_0%,rgba(255,255,255,.18),transparent_60%)]" />
            </motion.a>
          </motion.div>

          <motion.div variants={item} className="mt-4 text-xs md:text-sm text-foreground/60">
            Quick reply • Clear scope • Measurable outcomes
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}