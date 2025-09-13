import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PencilRuler, Fingerprint, SearchCheck, Layers, BarChart3, Boxes, FlaskConical } from "lucide-react";

const ICONS = [PencilRuler, Fingerprint, SearchCheck, Layers, BarChart3, Boxes, FlaskConical];

/** ===== 3D-ish oloid (SVG) with gradients, highlight, subtle texture, and cast shadow ===== */
function Oloid3D({ className = "w-48 md:w-64 h-auto" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Cast shadow */}
      <div className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 w-[70%] h-4 rounded-full bg-black/25 blur-md opacity-60" />
      <svg viewBox="0 0 200 120" className="w-full h-auto drop-shadow-lg">
        <defs>
          {/* Body gradient */}
          <linearGradient id="oloidBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEE9A6" />
            <stop offset="55%" stopColor="#FA8A00" />
            <stop offset="100%" stopColor="#FEC200" />
          </linearGradient>
          {/* Rim lighting for 3D illusion */}
          <radialGradient id="rimLight" cx="30%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="60%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {/* Very light noise texture (kept cheap) */}
          <filter id="noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0 0 0.07 0.12" />
            </feComponentTransfer>
          </filter>
          <clipPath id="oloidClip">
            <ellipse cx="100" cy="60" rx="92" ry="54" />
          </clipPath>
        </defs>

        {/* Body */}
        <ellipse cx="100" cy="60" rx="92" ry="54" fill="url(#oloidBody)" />
        {/* Inner edge line for depth */}
        <ellipse cx="100" cy="60" rx="92" ry="54" fill="none" stroke="#5A3A2E" strokeOpacity="0.18" strokeWidth="2" />
        {/* Specular highlight */}
        <ellipse cx="78" cy="42" rx="46" ry="26" fill="url(#rimLight)" />
        {/* Texture clipped to body */}
        <g clipPath="url(#oloidClip)">
          <rect x="0" y="0" width="200" height="120" filter="url(#noise)" opacity="0.22" />
        </g>
      </svg>
    </div>
  );
}

export default function HorizonPreviewPage() {
  const wrapRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Drive scene by scrolling from top of hero to top of "What I Do"
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });

  // Make it BIG and obvious: center → lower as you scroll
  const oloidY = useTransform(scrollYProgress, [0, 0.6], ["28vh", "76vh"]);
  const oloidRot = useTransform(scrollYProgress, [0, 0.6], [0, 720]); // 2 rotations

  // Burst into icons between 60–80%
  const burst = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <div ref={wrapRef} className="relative isolate min-h-[320vh] overflow-x-hidden bg-amber-50/30">
      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-[120vh] flex items-center justify-center text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-50 via-white/70 to-transparent -z-10" />

        {/* BIG 3D OLOID */}
        {!prefersReduced && (
          <motion.div
            style={{ top: oloidY, rotate: oloidRot }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          >
            <Oloid3D />
          </motion.div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight text-foreground">
            Crafting digital stories where{" "}
            <span className="bg-gradient-to-r from-[#FEE9A6] via-[#FA8A00] to-[#FEC200] bg-clip-text text-transparent">
              usability
            </span>{" "}
            meets beautiful design.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Preview scene only — your main homepage is untouched.
          </p>
        </div>
      </section>

      {/* ===== WHAT I DO (triangle tip + burst to icons under a dome) ===== */}
      <section id="what-i-do" className="relative min-h-[120vh] flex items-start justify-center">
        {/* Triangle "tip" */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]) }}
          className="absolute top-[14vh] left-1/2 -translate-x-1/2"
        >
          <svg width="96" height="88" viewBox="0 0 84 76" className="drop-shadow">
            <path d="M42 0 L84 76 L0 76 Z" fill="#5A3A2E" />
          </svg>
        </motion.div>

        {/* Glassy dome (FIXED: full arch visible) */}
        <div className="relative w-full max-w-6xl mx-auto px-6 pt-[36vh]">
          <svg viewBox="0 0 1200 420" className="w-full">
            <defs>
              <linearGradient id="domeStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5A3A2E" />
                <stop offset="50%" stopColor="#5A3A2E" />
                <stop offset="100%" stopColor="#5A3A2E" />
              </linearGradient>
              <radialGradient id="domeGlow" cx="50%" cy="20%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* the arch sits fully inside the viewBox now */}
            <path d="M 80 380 A 520 520 0 0 1 1120 380" fill="none" stroke="url(#domeStroke)" strokeWidth="8" />
            {/* soft glass glow */}
            <path d="M 80 380 A 520 520 0 0 1 1120 380" fill="none" stroke="url(#domeGlow)" strokeWidth="18" />
          </svg>

          {/* Burst → icons grid (swaying) */}
          <div className="relative -mt-32 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
            {ICONS.map((Icon, i) => (
              <motion.div
                key={i}
                style={{ opacity: burst, scale: burst }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.05 }}
              >
                <motion.div
                  animate={{ x: [0, 3, -3, 0] }}
                  transition={{ duration: 2.4 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white/85 backdrop-blur-md shadow"
                >
                  <Icon className="w-6 h-6 text-[#FA8A00]" />
                  <span className="text-sm font-semibold"></span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MY STORY ===== */}
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
