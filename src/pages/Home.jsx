// src/pages/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';

import AmbientBackdrop from '@/components/AmbientBackdrop';
import { staggerChildren, childFade } from '@/lib/motionPresets';

// Existing sections (adjust paths/names as needed)
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import MyToolkit from '@/components/sections/MyToolkit';
// New CTA section
import ConnectCTA from '@/components/sections/ConnectCTA';

export default function Home() {
  return (
    <div className="relative">
      {/* Ambient neon backdrop, sits behind everything */}
      <AmbientBackdrop intensity="low" />

      {/* Page-level motion: gently staggers each section in */}
      <motion.main
        variants={staggerChildren(0.08)}
        initial="hidden"
        animate="show"
      >
        <motion.section variants={childFade}>
          <Hero />
        </motion.section>

        <motion.section variants={childFade}>
          <MyToolkit />
        </motion.section>

        <motion.section variants={childFade}>
          <About />
        </motion.section>

        {/* <motion.section variants={childFade}><Work /></motion.section> */}
        {/* <motion.section variants={childFade}><Testimonials /></motion.section> */}

        <motion.section variants={childFade}>
          <ConnectCTA />
        </motion.section>
      </motion.main>
    </div>
  );
}

