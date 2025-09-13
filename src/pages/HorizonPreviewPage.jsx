// src/pages/HorizonPreview.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PencilRuler, Fingerprint, SearchCheck, Layers, BarChart3, Boxes, FlaskConical } from "lucide-react";

const ICONS = [PencilRuler, Fingerprint, SearchCheck, Layers, BarChart3, Boxes, FlaskConical];

export default function HorizonPreview() {
  const wrapRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Drive the whole scene by scrolling from the top of hero to the top of "What I Do"
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"], // progress: 0 (top-on-top) → 1 (bottom-on-top)
  });

  // Rolling oloid vertical travel (demo: center → lower)
  const oloidY = useTransform(scrollYProgress, [0, 0.6], ["35vh", "78vh"]);
  const oloidRot = useTransform(scrollYProgress, [0, 0.6], [0, 720]); // 2 turns

  // When to burst into icons (lands on the tip ~60%, burst finishes ~80%)
  const burst = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <div ref={wrapRef} className="relative isolate min-h-[320vh] overflow-x-hidden bg-amber-50/30">
      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-[120vh] flex items-center justify-center text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-50 via-white/60 to-transparent -z-10" />

        {/* Rolling oloid (simple ellipse stand-in) */}
        {!prefersReduced && (
          <motion.div
            style={{ top: oloidY, rotate: oloidRot }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-16 h-16 drop-shadow-lg"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="oloidGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FEE9A6" />
                  <stop offset="65%" stopColor="#FA8A00" />
                  <stop offset="100%" stopColor="#FEC200" />
                </linearGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="46" ry="28" fill="url(#oloidGrad)" stroke="#5A3A2E22" />
            </svg>
          </motion.div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight text-foreground">
            Crafting digital stories where <span className="bg-gradient-to-r from-[#FEE9A6] via-[#FA8A00] to-[#FEC200] bg-clip-text text-transparent">usability</span> meets beautiful design.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Preview scene only — your main homepage is untouched.
          </p>
        </div>
      </section>

      {/* ===== WHAT I DO (triangle tip + burst to icons under a dome) ===== */}
      <section id="what-i-do" className="relative min-h-[120vh] flex items-start justify-center">
        {/* Triangle tip that "catches" the oloid */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]) }}
          className="absolute top-[16vh] left-1/2 -translate-x-1/2"
        >
          <svg width="84" height="76" viewBox="0 0 84 76">
            <path d="M42 0 L84 76 L0 76 Z" fill="#5A3A2E" />
          </svg>
        </motion.div>

        {/* Dome + icons that sway slightly */}
        <div className="relative w-full max-w-6xl mx-auto px-6 pt-[32vh]">
          {/* Dome curve */}
          <svg viewBox="0 0 1200 240" className="w-full">
            <path d="M 60 220 A 540 540 0 0 1 1140 220" fill="none" stroke="#5A3A2E" strokeWidth="6" />
          </svg>

          {/* Burst → icons grid */}
          <div className="relative -mt-28 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
            {ICONS.map((Icon, i) => (
              <motion.div
                key={i}
                initial={false}
                style={{
                  opacity: burst,                       // 0 → 1 with scroll
                  scale: burst,                         // 0 → 1 with scroll
                }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: i * 0.04 }}
              >
                <motion.div
                  animate={{ x: [0, 3, -3, 0] }}
                  transition={{ duration: 2.4 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white/80 backdrop-blur-md shadow"
                >
                  <Icon className="w-6 h-6 text-[#FA8A00]" />
                  <span className="text-sm font-semibold"> {/* label optional */}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MY STORY (About) ===== */}
      <section id="my-story" className="relative min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">My Story</h2>
          <p className="text-lg text-muted-foreground">
            This is a placeholder for your About content. We’ll wire your real copy here later.
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center bg-card/70 border rounded-2xl p-10 shadow">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let’s create something together</h2>
          <p className="text-lg text-muted-foreground mb-6">This is a preview; your actual Contact page stays the same.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 hover:shadow-md transition">
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
