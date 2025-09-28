// src/components/sections/MyToolkit.jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search, LayoutTemplate, PlayCircle, Code2,
  Sparkles, FileText, BarChart3, Target
} from 'lucide-react';

const ITEMS = [
  { icon: Search, title: 'UX Research', bullets: ['User interviews', 'Usability testing', 'Competitor analysis'] },
  { icon: LayoutTemplate, title: 'UI Design', bullets: ['Wireframes', 'Hi-fi mockups', 'Design systems'] },
  { icon: PlayCircle, title: 'Prototyping', bullets: ['Interactive flows', 'Click-through demos'] },
  { icon: Code2, title: 'Web Development', bullets: ['Responsive builds', 'React / HTML / CSS'] },
  { icon: Sparkles, title: 'Branding & Identity', bullets: ['Color & type', 'Logo alignment', 'Storytelling'] },
  { icon: FileText, title: 'Content Strategy', bullets: ['Clear hierarchy', 'Structured copy'] },
  { icon: BarChart3, title: 'Data Visualization', bullets: ['Dashboards', 'Infographics', 'Clean visuals'] },
  { icon: Target, title: 'Business Strategy Alignment', bullets: ['KPIs & goals', 'Market positioning'] },
];

export default function MyToolkit() {
  const prefersReduced = useReducedMotion();

  // Big, obvious bounce so you can SEE it for sure
  const bounce = prefersReduced ? [0] : [-140, 0, -16, 0, -8, 0];

  const container = { show: { transition: { staggerChildren: 0.12 } } };
  const card = (i) => ({
    hidden: { opacity: 0, y: prefersReduced ? 0 : -140, scale: 0.98 },
    show: {
      opacity: 1,
      y: bounce,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0.35 : 0.95,
        times: prefersReduced ? undefined : [0, 0.55, 0.75, 0.88, 0.95, 1],
        ease: 'easeOut',
        delay: i * 0.07,
      },
    },
  });

  return (
    <section id="my-toolkit" className="relative py-16 lg:py-20" aria-labelledby="my-toolkit-heading">
      <div className="relative mx-auto max-w-6xl px-4">
        <h2 id="my-toolkit-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">My Toolkit</h2>

        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 overflow-visible"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          data-test="toolkit-grid" // diagnostic hook
        >
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={card(i)}
                className="group relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur
                           shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all
                           hover:shadow-[0_0_0_2px_rgba(124,77,255,0.45),0_18px_50px_rgba(124,77,255,0.35)]
                           will-change-transform"
                style={{ perspective: 1200 }}
              >
                {/* floor shadow (visible bounce cue) */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-2 w-20 rounded-full bg-black/60 opacity-40 group-hover:opacity-70 transition-opacity" />

                <div className="relative p-5 md:p-6">
                  {/* FLIPPER */}
                  <motion.div
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: 0 }}
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                  >
                    {/* FRONT: icon + title only */}
                    <div
                      className="absolute inset-0 flex items-center gap-3"
                      style={{
                        transform: 'rotateY(0deg) translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      {/* HARD-ROUND, OPAQUE GRADIENT CIRCLE (smaller) */}
                      <div
                        className="grid place-items-center rounded-full overflow-hidden ring-1 ring-white/15"
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '9999px', // hard guarantee circle
                          background:
                            'conic-gradient(from 220deg at 50% 50%, #0B1530 0deg, #0B1530 90deg, #06B6D4 180deg, #7C4DFF 320deg, #0B1530 360deg)',
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <h3 className="text-base md:text-lg font-semibold text-white">{item.title}</h3>
                    </div>

                    {/* BACK: bullets only (title removed) */}
                    <div
                      className="absolute inset-0 flex flex-col justify-center"
                      style={{
                        transform: 'rotateY(180deg) translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <ul className="mt-3 space-y-1.5 text-sm text-white">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-white" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* spacer to lock height so the flip doesn't jump */}
                    <div className="invisible select-none">
                      <h3 className="text-base md:text-lg font-semibold">.</h3>
                      <div className="mt-3 text-sm">.</div>
                    </div>
                  </motion.div>

                  {/* divider */}
                  <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
