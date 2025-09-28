import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, PenLine, Code, TestTube2, Repeat, CheckCircle, ArrowRight } from 'lucide-react';

// Local GIF (bundled)
import sereneGif from '@/assets/videos/serene-ux-process.gif';

/* ---------------- Shared animation helpers ---------------- */
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.2 },
};

/* Sparkle overlay for links/buttons */
const SparkleOverlay = ({ active }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} className="pointer-events-none absolute inset-0">
      {[...Array(6)].map((_, i) => {
        const x = (i * 17 + 8) % 100;
        const y = (i * 29 + 12) % 100;
        const delay = (i * 0.12) % 1.4;
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            {/* use current primary hue */}
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[hsl(var(--primary))]">
              <path fill="currentColor" d="M12 2l1.6 4.7L18 8.4l-4.2 2.9L14.8 16 12 13.7 9.2 16l1-4.7L6 8.4l4.4-1.7L12 2z" />
            </svg>
          </motion.span>
        );
      })}
    </motion.span>
  );
};

/* Inline Link with sparkle (for body copy) */
const LinkWithSparkle = ({ to, children, className = '' }) => {
  const [hover, setHover] = useState(false);
  return (
    <span className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={to} className={`relative inline-flex items-center gap-1.5 font-semibold underline decoration-transparent hover:decoration-current transition ${className}`}>
        {children}
      </Link>
      <SparkleOverlay active={hover} />
    </span>
  );
};

const UxProcessPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const [btnHover, setBtnHover] = useState({ a: false, b: false });

  const processSteps = [
    {
      icon: Search,
      title: '1. Discover & Research',
      description:
        'We start by understanding your business goals, target audience, and the problem we’re solving. This involves stakeholder interviews, user research, and competitive analysis to build a solid foundation.',
    },
    {
      icon: PenLine,
      title: '2. Define & Design',
      description:
        'With insights in hand, we map user flows, create wireframes, and develop high-fidelity visual designs. This is where strategy takes shape into an intuitive and engaging interface.',
    },
    {
      icon: Code,
      title: '3. Prototype & Build',
      description:
        'I create interactive prototypes that feel like the real product, allowing for early feedback. For web projects, this phase can extend into full development using modern technologies.',
    },
    {
      icon: TestTube2,
      title: '4. Test & Validate',
      description:
        'Usability testing is crucial. We put the designs in front of real users to observe their interactions, identify pain points, and validate our assumptions before launch.',
    },
    {
      icon: Repeat,
      title: '5. Iterate & Launch',
      description:
        'Based on feedback, we refine the design and prepare for launch. The process doesn’t end here; I believe in continuous improvement based on post-launch data and user feedback.',
    },
  ];

  const checklistItems = [
    'Clear project goals defined',
    'User personas and journeys mapped',
    'Accessible and inclusive design practices',
    'Data-driven design decisions',
    'Scalable and maintainable implementation',
  ];

  return (
    <div className="bg-[#FAFAF7]">
      <Helmet>
        <title>My UX Process - Jessabel.Art</title>
        <meta
          name="description"
          content="Discover the step-by-step process I use to design and develop user-centric digital experiences."
        />
      </Helmet>

      {/* ============== HERO ============== */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            className="text-center max-w-4xl mx-auto px-4 py-8 sm:py-10 rounded-3xl bg-[#FFEFD2] relative overflow-hidden"
          >
            {/* gentle animated shine */}
            {!prefersReducedMotion && (
              <motion.span
                className="pointer-events-none absolute inset-0 opacity-25"
                initial={{ x: '-110%' }}
                animate={{ x: ['-110%', '110%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.7), transparent)' }}
              />
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              <span
                className="inline-block"
                style={{
                  backgroundImage: 'linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                My UX Process
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-[hsl(var(--muted-foreground))]">
              A structured yet flexible approach to turning complex problems into elegant solutions.
            </p>

            {/* theme‑matched CTA buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span
                className="relative"
                onMouseEnter={() => setBtnHover((s) => ({ ...s, a: true }))}
                onMouseLeave={() => setBtnHover((s) => ({ ...s, a: false }))}
              >
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden h-11 font-semibold text-white rounded-full
                             bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                             hover:brightness-[1.08] hover:shadow-[0_12px_30px_rgba(0,0,0,.18)] transition"
                >
                  <Link to="/contact">
                    Start a Project <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                {!prefersReducedMotion && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 opacity-30"
                    initial={{ x: '-110%' }}
                    animate={{ x: btnHover.a ? '110%' : '-110%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                  />
                )}
                <SparkleOverlay active={btnHover.a} />
              </span>

              <span
                className="relative"
                onMouseEnter={() => setBtnHover((s) => ({ ...s, b: true }))}
                onMouseLeave={() => setBtnHover((s) => ({ ...s, b: false }))}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full transition border-[hsl(var(--accent))]
                             text-[hsl(var(--accent-foreground))]
                             hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                >
                  <Link to="/portfolio">See Case Studies</Link>
                </Button>
                <SparkleOverlay active={btnHover.b} />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== HIGHLIGHTS + CHECKLIST ============== */}
      <section className="mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: GIF + heading */}
            <motion.div {...fadeIn}>
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">UX Highlights</h2>
                <div className="h-1 w-32 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
              </div>

              {/* 16:9 glass frame */}
              <motion.div
                whileHover={!useReducedMotion && { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,.18)' }}
                className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden glass shadow-lg"
              >
                <img
                  src={sereneGif}
                  alt="Serene UX process animation"
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
              </motion.div>
            </motion.div>

            {/* Right: checklist */}
            <motion.div
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-md p-6 sm:p-8"
            >
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">Project Cornerstones</h3>
              <ul className="space-y-3">
                {checklistItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="flex items-center text-base sm:text-lg text-[hsl(var(--muted-foreground))]"
                  >
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--primary))] mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== PROCESS STEPS ============== */}
      <section className="mt-16 md:mt-24 bg-[#FFE7B3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">From discovery to launch</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Clear checkpoints keep teams aligned and decisions measurable.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-8 md:space-y-10"
          >
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, boxShadow: '0 24px 50px -24px rgba(0,0,0,.25)' }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-6 sm:px-8 sm:py-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 md:min-w-[320px]">
                      {/* Number badge w/ rotating gradient ring */}
                      <div className="relative w-14 h-14 rounded-full p-[2px] shadow">
                        {!prefersReducedMotion && (
                          <motion.span
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                'conic-gradient(from 0deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))',
                              opacity: 0.95,
                            }}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            aria-hidden="true"
                          />
                        )}
                        <span className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center font-extrabold text-[hsl(var(--foreground))]">
                          {i + 1}
                        </span>
                      </div>

                      {/* Icon chip + title */}
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ y: -2 }}
                          className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))/0.12] flex items-center justify-center"
                        >
                          <Icon size={26} className="text-[hsl(var(--accent))]" />
                        </motion.div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============== WRAP ============== */}
      <section className="bg-[#FFD894]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Want a deeper dive into artifacts and deliverables? Check the case studies on the{' '}
            <LinkWithSparkle to="/portfolio" className="text-[hsl(var(--accent-foreground))]">Portfolio</LinkWithSparkle> page.
          </p>
          <div className="h-1.5 w-40 mx-auto mt-4 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
        </div>
      </section>
    </div>
  );
};

export default UxProcessPage;
