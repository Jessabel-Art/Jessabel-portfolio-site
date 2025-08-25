import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

// Local assets (adjust paths if yours differ)
import artistPortrait from '@/assets/about/artist-portrait.png';
import toolsStatsBg from '@/assets/about/tools-stats-bg-strip.jpg';

/**
 * ABOUT PAGE — “My Story in Color”
 * Goals:
 *  - Keep your existing content structure but add a color-story background that changes per section
 *  - Respect reduced motion and stay performant (no giant videos, mostly CSS + lightweight motion)
 *  - Small, meaningful micro-interactions on hover/whileInView
 */

// Your brand color story — tweak freely
const COLOR_STOPS = [
  { name: 'Sunrise', from: '#ffe574', to: '#fa8a00' },
  { name: 'Citrus', from: '#fec200', to: '#ff9f1a' },
  { name: 'Copper', from: '#fa8a00', to: '#d74708' },
  { name: 'Rose', from: '#ff8f8f', to: '#f05d5d' },
  { name: 'Berry', from: '#f05d5d', to: '#b23b6b' },
];

// Shared animation presets
const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.25 },
};

function ColorBackdrop({ activeIdx, prefersReduced }) {
  // Single fixed element behind content that we recolor per-section
  const a = COLOR_STOPS[activeIdx] ?? COLOR_STOPS[0];
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      // Avoid heavy paints: use a simple linear-gradient + subtle noise overlay via background-image stack
      style={{
        backgroundImage: `linear-gradient(120deg, ${a.from}, ${a.to}), radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,0.18), transparent 60%)`,
        filter: 'saturate(1.05)',
      }}
      animate={prefersReduced ? {} : { opacity: 1, scale: [1.01, 1.02, 1.01] }}
      transition={prefersReduced ? {} : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function Chapter({ idx, title, years, bullets, onEnter, onLeave }) {
  return (
    <section className="relative py-20 md:py-28">
      {/* Color label chip */}
      <motion.div
        {...fadeIn}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-1 text-xs font-semibold tracking-wide text-black/80 backdrop-blur-sm dark:bg-white/10 dark:text-white/90"
      >
        <span className="inline-flex size-2.5 rounded-full" style={{ background: COLOR_STOPS[idx % COLOR_STOPS.length].to }} />
        {COLOR_STOPS[idx % COLOR_STOPS.length].name.toUpperCase()}
      </motion.div>

      <motion.h3 {...fadeIn} className="text-2xl md:text-3xl font-extrabold leading-tight">
        {title}
        <span className="ml-3 align-middle text-sm font-semibold opacity-70">{years}</span>
      </motion.h3>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-6 grid gap-3"
      >
        {bullets.map((b, i) => (
          <motion.li
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.05 } } }}
            className="flex items-start gap-3 text-base leading-relaxed text-black/80 dark:text-white/80"
          >
            <CheckCircle className="mt-1 size-5 flex-none opacity-80" />
            <span>{b}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Viewport enter/leave hooks to update background color */}
      <motion.div
        onViewportEnter={() => onEnter?.(idx)}
        onViewportLeave={() => onLeave?.(idx)}
        className="absolute inset-x-0 bottom-0 h-1"
      />
    </section>
  );
}

export default function AboutPage() {
  const prefersReduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative">
      <Helmet>
        <title>About — My Story in Color | Jessabel.Art</title>
        <meta name="description" content="UX/UI designer crafting interfaces with story-driven color and motion. Explore the journey, tools, and case studies." />
      </Helmet>

      <ColorBackdrop activeIdx={activeIdx} prefersReduced={prefersReduced} />

      {/* HERO */}
      <header className="relative mx-auto max-w-6xl px-4 pt-24 md:pt-28">
        <motion.div {...fadeIn} className="mb-6 inline-block rounded-full bg-white/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black/80 shadow-sm backdrop-blur-sm dark:bg-black/30 dark:text-white/90">
          My Story in Color
        </motion.div>
        <motion.h1 {...fadeIn} className="text-4xl md:text-6xl font-extrabold leading-[1.1]">
          I map <em className="not-italic underline decoration-4 underline-offset-4">ideas</em> onto screens.
        </motion.h1>
        <motion.p {...fadeIn} className="mt-4 max-w-2xl text-lg text-black/75 dark:text-white/80">
          I build clear, accessible interfaces—and add emotion through purposeful motion. Below is the journey that shaped my design lens.
        </motion.p>

        {/* Portrait with parallax float */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          animate={prefersReduced ? {} : { y: [0, -6, 0] }}
          transition={prefersReduced ? {} : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-10"
        >
          <img
            src={artistPortrait}
            alt="Illustrative portrait: a UX designer amidst color swatches and interface sketches"
            className="mx-auto w-full max-w-xl rounded-3xl shadow-xl ring-1 ring-black/10"
          />
          <figcaption className="mt-3 text-center text-sm opacity-70">Color is the narrative thread binding research to UI.</figcaption>
        </motion.figure>
      </header>

      {/* CONTENT SECTIONS */}
      <main className="mx-auto max-w-5xl px-4">
        <Chapter
          idx={0}
          title="UX/UI Designer & Consultant"
          years="2022 — Present"
          bullets={[
            'Lead end‑to‑end product discovery to polished handoff in Figma.',
            'Design systems with semantic tokens and component-driven UI.',
            'Partner with founders to align business goals with UX outcomes.',
          ]}
          onEnter={setActiveIdx}
        />

        <Chapter
          idx={1}
          title="Systems Implementation Lead"
          years="2018 — 2022"
          bullets={[
            'Drove platform rollouts; translated complex workflows into simple UIs.',
            'Built analytics views; coached teams on adoption and process QA.',
            'Aligned stakeholders across Ops, HR, and Compliance.',
          ]}
          onEnter={setActiveIdx}
        />

        <Chapter
          idx={2}
          title="Platform Usability Contributor"
          years="2015 — 2018"
          bullets={[
            'Audited interfaces with heuristic evaluations and quick wins.',
            'Introduced lightweight prototyping for faster iteration.',
            'Documented patterns that later became components.',
          ]}
          onEnter={setActiveIdx}
        />

        <Chapter
          idx={3}
          title="The Spark"
          years="2014"
          bullets={[
            'First freelance projects: identity + landing pages for local businesses.',
            'Fell in love with turning messy ideas into clear flows.',
          ]}
          onEnter={setActiveIdx}
        />

        <Chapter
          idx={4}
          title="Design Foundations"
          years="2011 — 2013"
          bullets={[
            'Hands-on practice in layout, color theory, and typography.',
            'Learned to critique and iterate without ego.',
          ]}
          onEnter={setActiveIdx}
        />

        {/* Tools & Stats strip */}
        <section className="relative my-16 overflow-hidden rounded-3xl ring-1 ring-black/10">
          <img
            src={toolsStatsBg}
            alt="Colorful strip background with tools & stats motif"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="relative grid grid-cols-1 gap-8 p-8 sm:grid-cols-3 md:p-12">
            {[
              { label: 'Years in CX/UX', value: '10+' },
              { label: 'Figma components shipped', value: '400+' },
              { label: 'Projects delivered', value: '60+' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="rounded-2xl bg-white/70 p-6 text-center shadow-md backdrop-blur-sm dark:bg-black/40"
              >
                <div className="text-3xl font-extrabold leading-none tracking-tight">{item.value}</div>
                <div className="mt-1 text-sm font-semibold opacity-70">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-24 text-center">
          <motion.p {...fadeIn} className="mx-auto max-w-2xl text-lg text-black/80 dark:text-white/80">
            Want the longer version? Dive into a case study—see how research translates into clean UI and gentle motion.
          </motion.p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild className="group rounded-full px-6 py-6 text-base font-semibold">
              <Link to="/projects">
                View Case Studies
                <ArrowRight className="ml-2 inline size-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="secondary" asChild className="group rounded-full px-6 py-6 text-base font-semibold">
              <Link to="/contact">
                Work Together
                <Sparkles className="ml-2 inline size-5 transition-transform group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
