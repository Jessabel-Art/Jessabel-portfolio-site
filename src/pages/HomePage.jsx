import React, { useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Star, Pause, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// NEW: pour section
import SkillsPourSection from '@/components/SkillsPourSection';

// Local hero image
import heroBg from '@/assets/images/hero-bg.jpeg';

/* ------------------------------------------------
   Helpers
--------------------------------------------------*/
const toInitials = (full = '') =>
  full
    .split(/[ ,]+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

const hueFor = (i) => (i * 47) % 360;

const grainDataUrl =
  // tiny repeating noise texture (base64)
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAAL0lEQVQ4T2NkoBAwUqifgXHfP2H4P0YgGQwxgGkY4r9GQqCkQzGg0E0GgYw4Gq4QpGgAAP0v3yZc8w2wAAAAASUVORK5CYII=';

/* ------------------------------------------------
   Tiny confetti burst (no external libs)
--------------------------------------------------*/
const ConfettiBurst = ({ trigger, prefersReducedMotion }) => {
  const [show, setShow] = useState(false);
  React.useEffect(() => {
    if (!trigger || prefersReducedMotion) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, [trigger, prefersReducedMotion]);
  if (!show) return null;

  const colors = ['#ff3ea5', '#00c2b2', '#fec200', '#6a5cff', '#34d399'];
  const pieces = Array.from({ length: 30 });

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.15;
        const rotate = Math.floor(Math.random() * 360);
        const size = 6 + Math.random() * 8;
        return (
          <motion.span
            key={`${trigger}-${i}`}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: size,
              height: size,
              background: colors[i % colors.length],
            }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: ['20vh', '60vh', '100vh'], opacity: [1, 1, 0], rotate }}
            transition={{ duration: 1.25 + Math.random() * 0.35, delay, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------
   Page
--------------------------------------------------*/
const HomePage = () => {
  const prefersReducedMotion = useReducedMotion();

  const [burst, setBurst] = useState(0);
  const handleConsultationClick = () => {
    toast({
      title: 'Let’s make something delightful ✨',
      description:
        'Taking you to the contact page to start a quick consultation.',
    });
    setBurst(Date.now()); // trigger confetti
  };

  const reviews = [
    { name: 'Alicia M., Founder', quote: 'Jess turned our messy idea into a clear, lovable product flow.' },
    { name: 'Derrick P., Product Lead', quote: 'Stakeholders finally understood the vision after her prototype.' },
    { name: 'Lena R., Marketing Director', quote: 'Brand system feels bold yet usable across all channels.' },
    { name: 'Mateo S., Engineering Manager', quote: 'Design handoff was a dream—clean files and thoughtful states.' },
    { name: 'Priya K., Startup CEO', quote: 'Customers stopped getting lost. Time-to-value went way up.' },
    { name: 'Nora T., Ops Lead', quote: 'Workshops were focused, friendly, and actually productive.' },
  ];

  /* ----------------------------
     Scroll progress
  -----------------------------*/
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* ----------------------------
     Hero parallax + spotlight
  -----------------------------*/
  const heroRef = useRef(null);
  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProg, [0, 1], ['0%', '-12%']);

  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const onHeroMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursor({ x, y });
  };

  /* ----------------------------
     Magnetic primary button
  -----------------------------*/
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const onMagMove = (e) => {
    if (prefersReducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setMag({ x: dx * 6, y: dy * 6 });
  };
  const resetMag = () => setMag({ x: 0, y: 0 });

  /* ----------------------------
     Testimonials marquee control
  -----------------------------*/
  const [paused, setPaused] = useState(false);
  const rowRef = useRef(null);

  // Simple mobile pager (scrolls the row; desktop continues marquee)
  const [page, setPage] = useState(0);
  const pagerTo = (i) => {
    setPage(i);
    setPaused(true);
    const el = rowRef.current;
    if (!el) return;
    const card = el.querySelectorAll('[data-tcard]')[i];
    if (card?.scrollIntoView) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  /* ==============================================================
     Render
  ============================================================== */
  const HEADLINE = 'I design seamless, human-centered digital experiences.';
  const headlineWords = useMemo(() => HEADLINE.split(' '), []);

  return (
    <div className="overflow-x-hidden bg-[#FEE6D4]">
      <Helmet>
        <title>Jessabel.Art · UX Designer</title>
        <meta
          name="description"
          content="Research-driven UX, clean UI, and design systems that scale. I turn ideas into seamless, human-centered digital experiences."
        />
      </Helmet>

      {/* Confetti overlay */}
      <ConfettiBurst trigger={burst} prefersReducedMotion={prefersReducedMotion} />

      {/* Scroll progress bar */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-[3px] z-[60] bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]"
      />

      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        className="relative min-h-[70vh] sm:min-h-[82vh] md:min-h-[86vh] grid place-items-center overflow-clip"
      >
        {/* subtle warm base */}
        <div className="absolute inset-0 bg-[#FAF6EE]" aria-hidden="true" />

        {/* Parallax image */}
        <motion.img
          src={heroBg}
          alt=""
          className="hero-image"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          sizes="100vw"
          style={{ y: prefersReducedMotion ? 0 : heroY }}
        />

        {/* Dark wash */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.25))]" />

        {/* Spotlight chaser */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              background: `radial-gradient(600px circle at ${cursor.x}% ${cursor.y}%, rgba(255,255,255,0.18), transparent 60%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Animated grain */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
            style={{
              backgroundImage: `url(${grainDataUrl})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '200px 120px', '0px 0px'],
            }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl"
          >
            {/* Staggered Headline */}
            <h1
              className="tracking-tight text-[clamp(2.1rem,7vw,5.2rem)] leading-[1.06] text-white"
              style={{
                fontFamily:
                  "'Poppins', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
                fontWeight: 800,
                textShadow: '0 10px 32px rgba(0,0,0,.65), 0 2px 10px rgba(0,0,0,.45)',
                WebkitTextStroke: '2px rgba(0,0,0,.35)',
              }}
            >
              {headlineWords.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2"
                  initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.02 * i, duration: 0.45, ease: 'easeOut' }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <p
              className="mt-5 sm:mt-6 max-w-[45ch] sm:max-w-3xl text-base sm:text-xl text-[#fff8e7] font-medium"
              style={{ textShadow: '0 3px 12px rgba(0,0,0,.55)' }}
            >
              Research-driven UX, thoughtful UI, and design systems that scale — so your product feels
              intuitive, inclusive, and measurable from day one.
            </p>

            <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Magnetic primary */}
              <motion.div
                onMouseMove={onMagMove}
                onMouseLeave={resetMag}
                animate={prefersReducedMotion ? { x: 0, y: 0 } : { x: mag.x, y: mag.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 0.3 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  className="relative overflow-hidden h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                             bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                             focus:outline-none focus:ring-2 focus:ring-white/70"
                  onClick={handleConsultationClick}
                >
                  <Link to="/contact" aria-label="Start a project">
                    Start a Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                    {!prefersReducedMotion && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-30"
                        initial={{ x: '-100%' }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background:
                            'linear-gradient(120deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%)',
                        }}
                      />
                    )}
                  </Link>
                </Button>
              </motion.div>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg
                           border-white/35 text-white bg-white/10 backdrop-blur hover:bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Link to="/portfolio" aria-label="See my work">
                  See my work
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wavy divider to body color (#FEE6D4) */}
        <svg
          className="absolute -bottom-[1px] left-0 right-0 w-full text-[#FEE6D4]"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,64 C360,0 1080,128 1440,32 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ===================== WHAT I BRING (POUR ANIMATION) ===================== */}
      <SkillsPourSection
        title="What I bring to every project"
        subtitle="A blend of research, structure, and craft that pours into outcomes."
        skills={[
          'UX Research',
          'Usability Testing',
          'Information Architecture',
          'Wireframing',
          'Prototyping',
          'Design Systems',
          'Accessibility (WCAG)',
          'UI Design',
          'Analytics',
          'Heuristic Review',
          'Figma',
          'Interaction Design',
        ]}
      />

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="relative py-14 sm:py-16 md:py-24 overflow-hidden bg-[linear-gradient(180deg,#FFFDF7_0%,#FFEFD9_100%)]">
        <div className="pointer-events-none absolute -top-10 inset-x-0 h-10 shadow-[0_-30px_50px_-20px_rgba(0,0,0,0.18)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Kind words from collaborators
            </h2>

            <button
              onClick={() => setPaused((p) => !p)}
              className="self-start sm:self-auto inline-flex items-center justify-center w-10 h-10 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition shadow-sm"
              aria-pressed={paused}
              title={paused ? 'Play carousel' : 'Pause carousel'}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>

          {/* Row: marquee on desktop, scrollable on mobile */}
          <div
            className="relative"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
              maskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
            }}
          >
            <div
              ref={rowRef}
              className="relative overflow-x-auto md:overflow-hidden no-scrollbar"
              aria-live={paused ? 'polite' : 'off'}
            >
              <ul
                className="flex items-stretch gap-4 sm:gap-6 animate-infinite-scroll px-4 sm:px-6"
                style={{
                  animationDuration: prefersReducedMotion ? '0s' : '38s',
                  animationPlayState:
                    paused || prefersReducedMotion ? 'paused' : 'running',
                }}
              >
                <li className="min-w-[4px] sm:min-w-[6px] pointer-events-none" aria-hidden="true" />
                {[...reviews, ...reviews].map((r, i) => {
                  const initials = toInitials(r.name);
                  const hue = hueFor(i);
                  return (
                    <li
                      key={`${r.name}-${i}`}
                      data-tcard
                      className="min-w-[260px] sm:min-w-[340px] md:min-w-[360px]"
                    >
                      <motion.div
                        onClick={() => setPaused((p) => !p)}
                        whileHover={
                          prefersReducedMotion
                            ? undefined
                            : { y: -4, rotate: -0.3, scale: 1.01 }
                        }
                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                        className="relative h-full rounded-2xl border border-[hsl(var(--border))] bg-white/92 backdrop-blur shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-5 md:p-6 flex flex-col justify-between cursor-pointer"
                        title="Click to pause/play"
                      >
                        {/* giant faint quote mark */}
                        <span className="pointer-events-none absolute -top-2 right-3 text-7xl font-serif text-black/5 select-none">
                          &ldquo;
                        </span>

                        <div className="flex items-center gap-3 mb-3">
                          {/* Avatar ring */}
                          <div
                            className="relative w-9 h-9 md:w-10 md:h-10 rounded-full p-[2px] shadow"
                            style={{
                              background: `conic-gradient(from 0deg, hsl(${hue} 85% 55%), hsl(${(hue + 60) % 360} 85% 55%))`,
                            }}
                            aria-hidden="true"
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-[10px] md:text-xs font-extrabold text-[hsl(var(--foreground))]">
                                {initials}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.span
                              initial={{ rotate: 0 }}
                              whileHover={
                                prefersReducedMotion ? undefined : { rotate: 16 }
                              }
                              transition={{
                                type: 'spring',
                                stiffness: 250,
                                damping: 12,
                              }}
                              className="inline-flex"
                              aria-hidden="true"
                            >
                              <Star className="w-4 h-4 text-[hsl(var(--accent))]" />
                            </motion.span>
                            <span className="font-semibold text-foreground">
                              {r.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                          “{r.quote}”
                        </p>

                        {/* subtle star glow pulse */}
                        {!prefersReducedMotion && (
                          <motion.span
                            className="pointer-events-none absolute -bottom-2 -left-2 w-16 h-16 rounded-full"
                            initial={{ opacity: 0.0, scale: 0.9 }}
                            animate={{ opacity: [0, 0.25, 0], scale: [0.9, 1.1, 0.9] }}
                            transition={{
                              duration: 3.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: (i % 4) * 0.4,
                            }}
                            style={{
                              background:
                                'radial-gradient(circle, rgba(255,215,130,.28), transparent 60%)',
                            }}
                          />
                        )}
                      </motion.div>
                    </li>
                  );
                })}
                <li className="min-w-[4px] sm:min-w-[6px] pointer-events-none" aria-hidden="true" />
              </ul>
            </div>

            {/* Mobile pager dots */}
            <div className="mt-4 flex md:hidden justify-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => pagerTo(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    page === i ? 'bg-[hsl(var(--accent))]' : 'bg-black/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Divider to CTA’s body color */}
        <svg
          className="absolute -bottom-[1px] left-0 right-0 w-full text-[#FEE6D4]"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,64 C360,0 1080,128 1440,32 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-14 sm:py-20 md:py-28 bg-[#FEE6D4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden border border-[hsl(var(--border))] bg-white/90 backdrop-blur"
          >
            {!prefersReducedMotion && (
              <motion.svg
                viewBox="0 0 600 600"
                className="absolute -z-10 left-1/2 -translate-x-1/2 -top-28 w-[54rem] opacity-[.23]"
                fill="url(#cta-grad)"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="cta-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#ff3ea5" />
                    <stop offset="1" stopColor="#00c2b2" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{
                    d: 'M300,520C430,520 540,420 520,300C500,180 380,80 260,100C140,120 60,220 80,340C100,460 170,520 300,520Z',
                  }}
                  animate={{
                    d: [
                      'M300,520C430,520 540,420 520,300C500,180 380,80 260,100C140,120 60,220 80,340C100,460 170,520 300,520Z',
                      'M300,520C410,540 560,420 520,300C480,180 380,80 260,100C160,140 60,220 100,340C140,460 200,500 300,520Z',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', repeatType: 'mirror' }}
                />
              </motion.svg>
            )}

            <div
              className="pointer-events-none absolute -inset-16"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(600px circle at 50% 0%, rgba(255,206,158,.25), transparent 60%)',
              }}
            />

            <motion.h2
              animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative text-2xl sm:text-4xl md:text-5xl font-bold text-foreground"
            >
              Ready to design something people love?
            </motion.h2>

            <p className="relative text-[15px] sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mt-3 sm:mt-4">
              Let’s collaborate and bring your vision to life with thoughtful UX, clean UI, and systems that scale.
            </p>

            <motion.div
              className="relative mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
              whileHover={prefersReducedMotion ? undefined : 'hovered'}
              initial="idle"
            >
              {!prefersReducedMotion && (
                <AnimatePresence>
                  <motion.span
                    variants={{ idle: { opacity: 0 }, hovered: { opacity: 1 } }}
                    className="pointer-events-none absolute inset-0"
                  >
                    {[...Array(6)].map((_, i) => {
                      const x = Math.random() * 100;
                      const y = Math.random() * 100;
                      const delay = (i * 0.25) % 1.8;
                      return (
                        <motion.span
                          key={i}
                          className="absolute"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
                        >
                          <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
                        </motion.span>
                      );
                    })}
                  </motion.span>
                </AnimatePresence>
              )}

              <Button
                asChild
                className="relative overflow-hidden h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                  {!prefersReducedMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-30"
                      initial={{ x: '-100%' }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        background:
                          'linear-gradient(120deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%)',
                      }}
                    />
                  )}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg"
              >
                <Link to="/portfolio">See recent work</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
