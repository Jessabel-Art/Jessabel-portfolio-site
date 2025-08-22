import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const grainDataUrl =
  // tiny repeating noise texture (base64), looks nice over imagery
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAAL0lEQVQ4T2NkoBAwUqifgXHfP2H4P0YgGQwxgGkY4r9GQqCkQzGg0E0GgYw4Gq4QpGgAAP0v3yZc8w2wAAAAASUVORK5CYII=';

/* ------------------------------------------------
   Page
--------------------------------------------------*/
const HomePage = () => {
  const handleConsultationClick = () => {
    toast({
      title: 'Let’s make something delightful ✨',
      description: 'Taking you to the contact page to start a quick consultation.',
    });
  };

  // Skills data with tags for filtering
  const expertise = [
    {
      icon: LayoutGrid,
      title: 'UX/UI Design',
      description: 'Intuitive, accessible, visually engaging interfaces.',
      tags: ['UI', 'Systems'],
    },
    {
      icon: Lightbulb,
      title: 'Prototyping',
      description: 'Interactive mockups for rapid iteration and clarity.',
      tags: ['UI', 'Systems'],
    },
    {
      icon: Users,
      title: 'User Research',
      description: 'Testing, surveys, and observation for real insights.',
      tags: ['Research'],
    },
    {
      icon: PenTool,
      title: 'Branding',
      description: 'Cohesive, memorable systems that scale.',
      tags: ['Brand'],
    },
    {
      icon: BarChart3,
      title: 'UX Strategy',
      description: 'Business goals aligned to user expectations.',
      tags: ['Systems', 'Biz'],
    },
    {
      icon: Briefcase,
      title: 'Career & Biz Support',
      description: 'Roadmaps, positioning, and GTM ops that work.',
      tags: ['Biz'],
    },
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

  /* ==============================================================
     Render
  ============================================================== */
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Jessabel.Art · UX Designer</title>
        <meta
          name="description"
          content="Research‑driven UX, clean UI, and design systems that scale. I turn ideas into seamless, human‑centered digital experiences."
        />
      </Helmet>

      {/* ============ HERO ============ */}
      <section className="relative min-h-[74vh] sm:min-h-[82vh] md:min-h-[86vh] grid place-items-center overflow-clip">
        <img src={heroBg} alt="" className="hero-image" loading="eager" decoding="async" />
        {/* Dark wash */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.25))]" />
        {/* Animated grain overlay */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
          style={{
            backgroundImage: `url(${grainDataUrl})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
          }}
          animate={{ backgroundPosition: ['0px 0px', '200px 120px', '0px 0px'] }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl">
            {/* Headline: Poppins ExtraBold + outline + shadow */}
            <h1
              className="tracking-tight text-[clamp(2.6rem,6.8vw,5.2rem)] leading-[1.04] text-white"
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
              className="mt-6 max-w-3xl text-lg sm:text-xl text-[#fff8e7] font-medium"
              style={{ textShadow: '0 3px 12px rgba(0,0,0,.55)' }}
            >
              Research‑driven UX, thoughtful UI, and design systems that scale — so your product feels
              intuitive, inclusive, and measurable from day one.
            </p>

            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Button
                asChild
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact" aria-label="Start a project">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg
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
      <section className="relative z-10 -mt-4 md:-mt-8 py-14 md:py-20 bg-[hsl(var(--background))] rounded-t-[28px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">What I Bring to Every Project</h2>
            <div className="h-1 w-40 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
            <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
              Strategy, taste, and rigorous usability—delivered through a clear, collaborative process.
            </p>
          </div>

          {/* Filter chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {ALL_CHIPS.map((chip) => {
              const active = chip === activeChip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition
                    ${active
                      ? 'text-white shadow-md bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]'
                      : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-foreground hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                    }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Cards with micro-interactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    transition={{ duration: 0.35 }}
                    whileHover={{ y: -6, rotate: -0.2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group rounded-2xl overflow-hidden"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.top}`} />
                    <div className="relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all p-6 sm:p-7">
                      {/* icon with parallax */}
                      <motion.div
                        className={`w-12 h-12 rounded-xl ${accent.chip} bg-opacity-20 flex items-center justify-center mb-4`}
                        whileHover={{ x: 2, y: -2 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      >
                        <Icon className={`${accent.text}`} size={24} />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{s.title}</h3>
                      <p className="mt-2 text-[hsl(var(--muted-foreground))]">{s.description}</p>

                      <div className="mt-4">
                        <Link
                          to={`/portfolio?filter=${encodeURIComponent(s.title)}`}
                          className="text-sm font-semibold underline underline-offset-4 text-[hsl(var(--primary))] hover:opacity-90"
                        >
                          See examples
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (pause/play + avatars) ============ */}
      <section className="py-14 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-7 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">Kind words from collaborators</h2>
            <button
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-semibold hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
              aria-pressed={paused}
              title={paused ? 'Play carousel' : 'Pause carousel'}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
              {paused ? 'Play' : 'Pause'}
            </button>
          </div>

          <div className="w-full overflow-hidden mask-edge-x">
            <ul
              className="flex gap-5 animate-infinite-scroll"
              style={{ animationDuration: '38s', animationPlayState: paused ? 'paused' : 'running' }}
              aria-live={paused ? 'polite' : 'off'}
            >
              {[...reviews, ...reviews].map((r, i) => {
                const initials = toInitials(r.name);
                // simple hue shift for avatar backgrounds
                const hue = (i * 47) % 360;
                return (
                  <li key={`${r.name}-${i}`} className="min-w-[280px] sm:min-w-[340px]">
                    <div className="rounded-2xl bg-white/92 backdrop-blur shadow-lg border border-[hsl(var(--border)/0.8)] p-5 h-full flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                          style={{ background: `linear-gradient(135deg, hsl(${hue} 80% 55%), hsl(${(hue + 40) % 360} 80% 55%))` }}
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[hsl(var(--accent))]" />
                          <span className="font-semibold text-foreground">{r.name}</span>
                        </div>
                      </div>
                      <p className="text-[hsl(var(--muted-foreground))]">“{r.quote}”</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CTA (sparkles on hover) ============ */}
      <section className="py-16 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="glass relative rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Ready to design something people love?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mt-3 sm:mt-4">
              Let’s collaborate and bring your vision to life with thoughtful UX, clean UI, and systems that scale.
            </p>

            {/* Buttons + sparkles */}
            <motion.div
              className="relative mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              whileHover="hovered"
              initial="idle"
            >
              {/* sparkle particles */}
              <AnimatePresence>
                <motion.span
                  variants={{
                    idle: { opacity: 0 },
                    hovered: { opacity: 1 },
                  }}
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

              <Button
                asChild
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg">
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
