import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  LayoutGrid,
  Lightbulb,
  Users,
  PenTool,
  BarChart3,
  Briefcase,
  Star,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Local hero image
import heroBg from '@/assets/images/hero-bg.jpg';

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
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAAL0lEQVQ4T2NkoBAwUqifgXHfP2H4P0YgGQwxgGkY4r9GQqCkQzGg0E0GgYw4Gq4QpGgAAP0v3yZc8w2wAAAAASUVORK5CYII=';

/* ------------------------------------------------
   Page
--------------------------------------------------*/
const HomePage = () => {
  const prefersReducedMotion = useReducedMotion();

  const handleConsultationClick = () => {
    toast({
      title: 'Let’s make something delightful ✨',
      description: 'Taking you to the contact page to start a quick consultation.',
    });
  };

  // Skills data with tags for filtering
  const expertise = [
    { icon: LayoutGrid, title: 'UX/UI Design', description: 'Intuitive, accessible, visually engaging interfaces.', tags: ['UI', 'Systems'] },
    { icon: Lightbulb, title: 'Prototyping', description: 'Interactive mockups for rapid iteration and clarity.', tags: ['UI', 'Systems'] },
    { icon: Users, title: 'User Research', description: 'Testing, surveys, and observation for real insights.', tags: ['Research'] },
    { icon: PenTool, title: 'Branding', description: 'Cohesive, memorable systems that scale.', tags: ['Brand'] },
    { icon: BarChart3, title: 'UX Strategy', description: 'Business goals aligned to user expectations.', tags: ['Systems', 'Biz'] },
    { icon: Briefcase, title: 'Career & Biz Support', description: 'Roadmaps, positioning, and GTM ops that work.', tags: ['Biz'] },
  ];

  const reviews = [
    { name: 'Alicia M., Founder', quote: 'Jess turned our messy idea into a clear, lovable product flow.' },
    { name: 'Derrick P., Product Lead', quote: 'Stakeholders finally understood the vision after her prototype.' },
    { name: 'Lena R., Marketing Director', quote: 'Brand system feels bold yet usable across all channels.' },
    { name: 'Mateo S., Engineering Manager', quote: 'Design handoff was a dream—clean files and thoughtful states.' },
    { name: 'Priya K., Startup CEO', quote: 'Customers stopped getting lost. Time-to-value went way up.' },
    { name: 'Nora T., Ops Lead', quote: 'Workshops were focused, friendly, and actually productive.' },
  ];

  const ACCENTS = [
    { top: 'from-[#22d3ee] to-[#a78bfa]', chip: 'bg-[#22d3ee]', text: 'text-[#22d3ee]' },
    { top: 'from-[#a78bfa] to-[#f59e0b]', chip: 'bg-[#a78bfa]', text: 'text-[#a78bfa]' },
    { top: 'from-[#f59e0b] to-[#fb7185]', chip: 'bg-[#f59e0b]', text: 'text-[#f59e0b]' },
    { top: 'from-[#fb7185] to-[#34d399]', chip: 'bg-[#fb7185]', text: 'text-[#fb7185]' },
    { top: 'from-[#34d399] to-[#60a5fa]', chip: 'bg-[#34d399]', text: 'text-[#34d399]' },
    { top: 'from-[#60a5fa] to-[#22d3ee]', chip: 'bg-[#60a5fa]', text: 'text-[#60a5fa]' },
  ];

  /* ----------------------------
     Filter chips state
  -----------------------------*/
  const ALL_CHIPS = ['All', 'Research', 'UI', 'Systems', 'Brand', 'Biz'];
  const [activeChip, setActiveChip] = useState('All');

  const filteredExpertise = useMemo(() => {
    if (activeChip === 'All') return expertise;
    return expertise.filter((e) => e.tags.includes(activeChip));
  }, [activeChip, expertise]);

  /* ----------------------------
     Testimonials marquee control
  -----------------------------*/
  const [paused, setPaused] = useState(false);

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
     Micro "magnetic" for buttons
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

  /* ==============================================================
     Render
  ============================================================== */
  return (
    <div className="overflow-x-hidden bg-[#FAFAF7]">
      <Helmet>
        <title>Jessabel.Art · UX Designer</title>
        <meta
          name="description"
          content="Research‑driven UX, clean UI, and design systems that scale. I turn ideas into seamless, human‑centered digital experiences."
        />
      </Helmet>

      {/* Scroll progress bar */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-[3px] z-[60] bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]"
      />

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        className="relative min-h-[70vh] sm:min-h-[82vh] md:min-h-[86vh] grid place-items-center overflow-clip"
      >
        {/* Offwhite base */}
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

        {/* Spotlight that follows cursor */}
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
            style={{ backgroundImage: `url(${grainDataUrl})`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}
            animate={{ backgroundPosition: ['0px 0px', '200px 120px', '0px 0px'] }}
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
            {/* Headline */}
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
              I design seamless, human‑centered digital experiences.
            </h1>

            <p
              className="mt-5 sm:mt-6 max-w-[45ch] sm:max-w-3xl text-base sm:text-xl text-[#fff8e7] font-medium"
              style={{ textShadow: '0 3px 12px rgba(0,0,0,.55)' }}
            >
              Research‑driven UX, thoughtful UI, and design systems that scale — so your product feels
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
                  className="h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                             bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                             focus:outline-none focus:ring-2 focus:ring-white/70"
                  onClick={handleConsultationClick}
                >
                  <Link to="/contact" aria-label="Start a project">
                    Start a Project
                    <ArrowRight className="ml-2 h-5 w-5" />
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
      </section>

      {/* ============ WHAT I BRING (with filter chips) ============ */}
      <section className="relative z-10 -mt-4 md:-mt-8 py-12 sm:py-14 md:py-20 bg-[#FAFAF7] rounded-t-[24px] md:rounded-t-[28px] shadow-2xl">
        {/* edge fade to separate from hero */}
        <div className="pointer-events-none absolute -top-10 inset-x-0 h-10 shadow-[0_-30px_50px_-20px_rgba(0,0,0,0.18)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left space-y-3 sm:space-y-4 mb-5 sm:mb-7 md:mb-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">What I Bring to Every Project</h2>
            <div className="h-1 w-36 sm:w-40 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
            <p className="text-[15px] sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
              Strategy, taste, and rigorous usability—delivered through a clear, collaborative process.
            </p>
          </div>

          {/* Filter chips */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap sm:whitespace-normal no-scrollbar">
            <motion.div
              className="flex gap-2 sm:flex-wrap"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {ALL_CHIPS.map((chip) => {
                const active = chip === activeChip;
                return (
                  <motion.button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition shrink-0
                      ${
                        active
                          ? 'text-white shadow-md bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]'
                          : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-foreground hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                      }`}
                    aria-pressed={active}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.25 }}
                  >
                    {chip}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-5 sm:gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            <AnimatePresence mode="popLayout">
              {filteredExpertise.map((s, index) => {
                const Icon = s.icon;
                const accent = ACCENTS[index % ACCENTS.length];
                return (
                  <motion.div
                    key={s.title}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.35 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -6, rotate: -0.2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    className="relative group rounded-2xl overflow-hidden h-full"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.top}`} />
                    <div className="relative h-full rounded-2xl border border-[hsl(var(--border))] bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all p-5 sm:p-7 flex flex-col">
                      {/* icon with parallax */}
                      <motion.div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${accent.chip} bg-opacity-20 flex items-center justify-center mb-3 sm:mb-4`}
                        whileHover={prefersReducedMotion ? undefined : { x: 2, y: -2 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      >
                        <Icon className={`${accent.text}`} size={22} />
                      </motion.div>
                      <h3 className="text-lg sm:text-2xl font-bold text-foreground">{s.title}</h3>
                      <p className="mt-1.5 sm:mt-2 text-[hsl(var(--muted-foreground))]">{s.description}</p>
                      <div className="mt-auto pt-2" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="relative py-14 sm:py-16 md:py-24 overflow-hidden bg-[#FDF8EE]">
        <div className="pointer-events-none absolute -top-10 inset-x-0 h-10 shadow-[0_-30px_50px_-20px_rgba(0,0,0,0.18)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-4xl md:5xl font-bold text-foreground">
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

          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
              maskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
            }}
          >
            <ul
              className="flex items-stretch gap-4 sm:gap-6 animate-infinite-scroll px-4 sm:px-6"
              style={{
                animationDuration: prefersReducedMotion ? '0s' : '38s',
                animationPlayState: paused || prefersReducedMotion ? 'paused' : 'running',
              }}
              aria-live={paused ? 'polite' : 'off'}
            >
              <li className="min-w-[4px] sm:min-w-[6px] pointer-events-none" aria-hidden="true" />
              {[...reviews, ...reviews].map((r, i) => {
                const initials = toInitials(r.name);
                const hue = hueFor(i);
                return (
                  <li key={`${r.name}-${i}`} className="min-w-[260px] sm:min-w-[340px] md:min-w-[360px]">
                    <motion.div
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                      className="h-full rounded-2xl border border-[hsl(var(--border))] bg-white/92 backdrop-blur shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-5 md:p-6 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3 mb-3">
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
                            whileHover={prefersReducedMotion ? undefined : { rotate: 16 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                            className="inline-flex"
                            aria-hidden="true"
                          >
                            <Star className="w-4 h-4 text-[hsl(var(--accent))]" />
                          </motion.span>
                          <span className="font-semibold text-foreground">{r.name}</span>
                        </div>
                      </div>

                      <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">“{r.quote}”</p>
                    </motion.div>
                  </li>
                );
              })}
              <li className="min-w-[4px] sm:min-w-[6px] pointer-events-none" aria-hidden="true" />
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-14 sm:py-20 md:py-28 bg-[#FAFAF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="glass relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden border border-[hsl(var(--border))] bg-white/90 backdrop-blur"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Ready to design something people love?
            </h2>
            <p className="text-[15px] sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mt-3 sm:mt-4">
              Let’s collaborate and bring your vision to life with thoughtful UX, clean UI, and systems that scale.
            </p>

            {/* Buttons + sparkles */}
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
                    {[...Array(8)].map((_, i) => {
                      const x = Math.random() * 100;
                      const y = Math.random() * 100;
                      const delay = (i * 0.12) % 1.2;
                      return (
                        <motion.span
                          key={i}
                          className="absolute"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
                        >
                          <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                        </motion.span>
                      );
                    })}
                  </motion.span>
                </AnimatePresence>
              )}

              <Button
                asChild
                className="h-11 w-full sm:w-auto rounded-full px-6 sm:px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
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
