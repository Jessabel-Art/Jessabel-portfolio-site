import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, Sparkles, ArrowRight } from 'lucide-react';

// Local assets
import artistPortrait from '@/assets/about/artist-portrait.png';
import toolsStatsBg from '@/assets/about/tools-stats-bg-strip.jpg';

const WARM_BROWN = 'var(--warm-brown-hex)';

/* ---------- Shared animation presets ---------- */
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.3 },
};

/* ---------- Story colors for the rail ---------- */
const STORY_COLORS = [
  ['#ffe574', '#fa8a00'], // Hero
  ['#fec200', '#ff9f1a'], // Story+Education
  ['#ff8f8f', '#f05d5d'], // Skills
  ['#d74708', '#8a2c0a'], // Journey
  ['#fec200', '#fa8a00'], // CTA
];

const skills = [
  'UX Research','UI Design','Prototyping','Design Systems',
  'Figma','Information Architecture','Heuristic Evaluation',
  'Usability Testing','Brand Systems','Accessibility (WCAG)',
  'React/Tailwind','Analytics'
];

const journey = [
  { year: '2022–Present', title: 'UX/UI Designer & Consultant', company: 'Creative & Tech Sector',
    description: 'Partnering with startups and small businesses on research, UI, and design systems.' },
  { year: '2018–2022', title: 'Systems Implementation Lead', company: 'Healthcare SaaS',
    description: 'Rolled out an internal platform; focused on usability, accessibility, and adoption.' },
  { year: '2015–2018', title: 'Platform Usability Contributor', company: 'Fintech / Insurance',
    description: 'Helped define features, ran studies, and improved cross-team workflow efficiency.' },
  { year: '2014', title: 'The Spark', company: 'Independent',
    description: 'Built early websites and learned SEO; realized design could be both art and utility.' },
  { year: '2011', title: 'Design Intern — NUA on the Move', company: 'New Urban Arts',
    description: 'Mapped studio zones, supported build-out decisions, and showed my first public work.' }
];

const education = [
  { school: 'Western Governors University', degree: 'MBA (in progress)', year: '2025' },
  { school: 'Western Governors University', degree: 'B.S. Business Administration, Management', year: '2024' },
  { school: 'Full Sail University', degree: 'Certificate in User Experience', year: '2024' },
  { school: 'Community College of Rhode Island', degree: 'A.S. Business Administration', year: '2022' },
];

/* ---------- Tiny sparkle overlay for links/buttons ---------- */
const SparkleOverlay = ({ active }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      className="pointer-events-none absolute inset-0"
    >
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
            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
          </motion.span>
        );
      })}
    </motion.span>
  );
};

/* Inline link with sparkle (use for any text links if needed) */
const LinkWithSparkle = ({ to, href, children, className = '' }) => {
  const [hover, setHover] = useState(false);
  const common =
    "relative inline-flex items-center gap-1.5 font-semibold underline decoration-transparent hover:decoration-current transition";
  if (to) {
    return (
      <span className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Link to={to} className={`${common} ${className}`}>{children}</Link>
        <SparkleOverlay active={hover} />
      </span>
    );
  }
  return (
    <span className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <a href={href} className={`${common} ${className}`}>{children}</a>
      <SparkleOverlay active={hover} />
    </span>
  );
};

/* ---------- Sticky Story Rail (color updates per section) ---------- */
const StoryRail = ({ index = 0 }) => {
  const [from, to] = STORY_COLORS[index % STORY_COLORS.length];
  return (
    <motion.div
      aria-hidden
      className="hidden lg:block fixed left-4 top-28 bottom-24 w-[6px] rounded-full z-10"
      style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0.9 }}
      transition={{ duration: 0.4 }}
    />
  );
};

/* ---------- Kinetic Headline (word-by-word reveal) ---------- */
const RevealWords = ({ text, className }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: '0.6em', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: i * 0.04, ease: 'easeOut' }}
          className="inline-block will-change-transform"
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
};

/* ---------- Small hook for parallax drift ---------- */
const useParallaxY = (strength = 20) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end','end start'] });
  const y = useTransform(scrollYProgress, [0,1], [strength, -strength]);
  return { ref, y };
};

const AboutPage = () => {
  const prefersReducedMotion = useReducedMotion();

  /* ---------- SEO ---------- */
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jessabel',
    jobTitle: 'UX Designer',
    url: 'https://jessabel.art/about',
    sameAs: ['https://www.linkedin.com/', 'https://www.behance.net/'],
    knowsAbout: [
      'User Experience','User Interface','User Research','Usability Testing',
      'Design Systems','Figma','Accessibility','Information Architecture'
    ]
  };

  /* ---------- Portrait parallax + spotlight ---------- */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] });
  const portraitY = useTransform(scrollYProgress, [0,1], ['0%','-8%']);
  const [cursor, setCursor] = useState({ x: 60, y: 40 });
  const onHoverMove = (e) => {
    if (prefersReducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    setCursor({ x: ((e.clientX - r.left)/r.width)*100, y: ((e.clientY - r.top)/r.height)*100 });
  };

  /* hover state for button sparkles */
  const [btnHover, setBtnHover] = useState({ a:false, b:false, c:false, d:false });

  /* ---------- Section state for StoryRail ---------- */
  const [activeSection, setActiveSection] = useState(0);

  /* ---------- Skills parallax ---------- */
  const { ref: skillsRef, y: skillsBgY } = useParallaxY(18);

  return (
    <div className="bg-[#FEE6D4]">
      <Helmet>
        <title>Jessabel — UX Designer | About</title>
        <meta
          name="description"
          content="Jessabel — UX Designer focused on human-centered, data-informed product design. View case studies, resume, and process."
        />
        <script type="application/ld+json">{JSON.stringify(personLd)}</script>
      </Helmet>

      {/* Story color rail */}
      <StoryRail index={activeSection} />

      {/* ===================== HERO ===================== */}
      <motion.section
        ref={heroRef}
        className="pt-20 pb-16 sm:pb-24"
        onViewportEnter={() => setActiveSection(0)}
        viewport={{ amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <motion.div {...fadeIn} className="lg:col-span-3 space-y-7 max-w-3xl">
              <h1
                className="font-hero font-extrabold tracking-tight text-4xl md:text-5xl lg:text-6xl leading-[1.12]
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff),var(--btn-teal,#00c2b2))]
                           bg-clip-text text-transparent"
                style={{ textShadow: '0 6px 22px rgba(0,0,0,0.22)' }}
              >
                <RevealWords text="I turn complex ideas into intuitive, human-centered experiences." />
              </h1>

              <p className="text-lg md:text-xl leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
                I bridge <strong>business strategy</strong>, <strong>user research</strong>, and
                <strong> design systems</strong> to ship products that are beautiful, usable, and measurable.
                My background across business and ops means I design for both <em>people</em> and
                <em> outcomes</em>.
              </p>

              {/* Proof chips */}
              <ul className="grid sm:grid-cols-3 gap-3">
                <ProofChip icon={<CheckCircle size={18} />} label="Human-centered" sub="Clear, inclusive flows" />
                <ProofChip icon={<BarChart3 size={18} />} label="Data-informed" sub="Decisions & metrics" />
                <ProofChip icon={<Sparkles size={18} />} label="Systems + UI" sub="Design systems & craft" />
              </ul>

              {/* CTAs with sparkle + color-shift on hover */}
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="relative" onMouseEnter={()=>setBtnHover(s=>({...s,a:true}))} onMouseLeave={()=>setBtnHover(s=>({...s,a:false}))}>
                  <Button
                    asChild size="lg"
                    className="relative overflow-hidden h-11 font-semibold text-white shadow-lg
                               bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                               hover:brightness-[1.08] hover:shadow-[0_12px_30px_rgba(0,0,0,.18)]
                               transition focus:outline-none focus:ring-2 focus:ring-white/70"
                  >
                    <Link to="/portfolio">View Case Studies</Link>
                  </Button>
                  {/* gradient sweep (only while hovered) */}
                  {!prefersReducedMotion && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 opacity-30"
                      initial={{ x: '-110%' }}
                      animate={{ x: btnHover.a ? '110%' : '-110%' }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                      style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                    />
                  )}
                  <SparkleOverlay active={btnHover.a} />
                </span>

                <span className="relative" onMouseEnter={()=>setBtnHover(s=>({...s,b:true}))} onMouseLeave={()=>setBtnHover(s=>({...s,b:false}))}>
                  <Button asChild size="lg" variant="outline"
                    className="h-11 transition border-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]
                               hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
                    <Link to="/contact">Contact Me</Link>
                  </Button>
                  <SparkleOverlay active={btnHover.b} />
                </span>

                <span className="relative" onMouseEnter={()=>setBtnHover(s=>({...s,c:true}))} onMouseLeave={()=>setBtnHover(s=>({...s,c:false}))}>
                  <Button asChild size="lg" variant="outline"
                    className="h-11 transition border-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]
                               hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
                    <a href="/resume.pdf" target="_blank" rel="noreferrer">Download Resume</a>
                  </Button>
                  <SparkleOverlay active={btnHover.c} />
                </span>
              </div>
            </motion.div>

            {/* Portrait with parallax + spotlight */}
            <motion.div
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="lg:col-span-2 relative"
              onMouseMove={onHoverMove}
            >
              {!prefersReducedMotion && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                  style={{
                    background: `radial-gradient(480px circle at ${cursor.x}% ${cursor.y}%, rgba(255,255,255,0.18), transparent 60%)`,
                  }}
                  aria-hidden="true"
                />
              )}

              <motion.img
                style={{ y: prefersReducedMotion ? 0 : portraitY }}
                className="w-full h-auto object-cover rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,.18)]
                           border border-[hsl(var(--border)/0.7)] ring-1 ring-white/40 bg-[hsl(var(--muted))/0.2]"
                alt="Jessabel — portrait"
                src={artistPortrait}
                width={860}
                height={1080}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===================== STORY + EDUCATION ===================== */}
      <motion.section
        className="pb-20 sm:pb-24"
        onViewportEnter={() => setActiveSection(1)}
        viewport={{ amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div {...fadeIn} className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))]">A practical path into UX</h2>
              <p className="text-lg leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
                I started in business and people operations, where I saw how clunky tools waste time.
                That led me to UX—combining <strong>analytical problem-solving</strong> with
                <strong> creative design</strong>. Today, I run projects end-to-end: from research and
                information architecture to prototyping and visual design.
              </p>
              <p className="text-lg leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
                I’ve shipped client portals, onboarding flows, and internal tools that reduce friction
                for non-technical teams. I care about evidence, inclusivity, and craft—because details
                are how we earn trust.
              </p>
              {/* Example inline link with sparkle (use anywhere) */}
              <p className="text-lg" style={{ color: WARM_BROWN }}>
                See my <LinkWithSparkle to="/portfolio" className="text-[hsl(var(--accent-foreground))]">case studies</LinkWithSparkle> for outcomes and process.
              </p>
            </motion.div>

            {/* Education */}
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }}>
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-3">Education</h3>
              <ul className="divide-y divide-[hsl(var(--border)/0.7)] border-t border-b border-[hsl(var(--border)/0.7)]">
                {education.map((e) => (
                  <li key={`${e.school}-${e.year}`} className="grid grid-cols-[1fr_auto] gap-4 py-3">
                    <span className="font-semibold text-[hsl(var(--foreground))]">{e.school}</span>
                    <span className="text-right" style={{ color: WARM_BROWN }}>
                      {e.degree} <span className="opacity-80">({e.year})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===================== SKILLS (glass panel with parallax) ===================== */}
      <motion.section
        ref={skillsRef}
        className="relative py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${toolsStatsBg})` }}
        onViewportEnter={() => setActiveSection(2)}
        viewport={{ amount: 0.5 }}
      >
        <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ y: prefersReducedMotion ? 0 : skillsBgY }} />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_400px_at_15%_20%,rgba(0,0,0,.14),transparent_60%),radial-gradient(900px_400px_at_85%_60%,rgba(0,0,0,.14),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            className="mx-auto w-full md:w-[92%] lg:w-[88%] rounded-[22px] md:rounded-[26px]
                       border border-white/45 bg-white/18 backdrop-blur-lg shadow-[0_24px_60px_rgba(0,0,0,.22)]
                       px-5 sm:px-8 py-8 sm:py-10"
            aria-label="Skill toolkit"
          >
            {/* Header: bold white */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-7 md:mb-8 text-white">
              What I work with
            </h2>

            {/* Pills: with pink dot icon */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
              {skills.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  className="flex"
                >
                  <span
                    className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
                               bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm overflow-hidden"
                  >
                    {/* pink dot icon */}
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--btn-pink,#ff3ea5)]" />
                    {s}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===================== UX JOURNEY (with progress fill) ===================== */}
      <JourneySection setActiveSection={setActiveSection} />

      {/* ===================== PROCESS CTA (theme-matched buttons) ===================== */}
      <motion.section
        className="relative pt-12 md:pt-16 pb-8 md:pb-10 -mb-1 bg-[#FEE6D4]"
        onViewportEnter={() => setActiveSection(4)}
        viewport={{ amount: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-[hsl(var(--border)/0.7)]">
          {/* gentle radial glow */}
          <div
            className="pointer-events-none absolute -inset-10"
            style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(255,206,158,.25), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16">
            <motion.div {...fadeIn} className="mx-auto max-w-3xl">
              <h2
                className="text-4xl md:text-5xl font-extrabold
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           bg-clip-text text-transparent"
              >
                Curious about my process?
              </h2>

              <p className="mt-3 text-xl md:text-2xl text-[hsl(var(--foreground))]">
                See how I approach projects from discovery to launch.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                {/* Primary: theme gradient + hover light-up */}
                <span className="relative" onMouseEnter={()=>setBtnHover(s=>({...s,d:true}))} onMouseLeave={()=>setBtnHover(s=>({...s,d:false}))}>
                  <Button asChild size="lg"
                    className="relative overflow-hidden rounded-full px-6 h-11 font-semibold text-white
                               bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                               hover:brightness-[1.08] hover:shadow-[0_12px_30px_rgba(0,0,0,.18)] transition">
                    <Link to="/process">
                      View My UX Process{' '}
                      <motion.span whileHover={{ rotate: 8 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </motion.span>
                    </Link>
                  </Button>
                  {!prefersReducedMotion && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 opacity-30"
                      initial={{ x: '-110%' }}
                      animate={{ x: btnHover.d ? '110%' : '-110%' }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                      style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                    />
                  )}
                  <SparkleOverlay active={btnHover.d} />
                </span>

                {/* Secondary: outline that fills with accent on hover */}
                <Button asChild size="lg" variant="outline"
                  className="rounded-full px-6 h-11 transition border-[hsl(var(--accent))]
                             text-[hsl(var(--accent-foreground))]
                             hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
                  <Link to="/portfolio">See Case Studies</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* bottom separator into footer */}
        <svg className="absolute -bottom-1 left-0 right-0 w-full text-[#0B0F1A]" viewBox="0 0 1440 20" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0 L1440,20 L0,20 Z" fill="currentColor" />
        </svg>
      </motion.section>
    </div>
  );
};

/* ---------- Journey Section extracted for scroll progress fill ---------- */
const JourneySection = ({ setActiveSection }) => {
  const railRef = useRef(null);
  const { scrollYProgress: railProg } = useScroll({ target: railRef, offset: ['start 75%','end 25%'] });
  const fillScale = useTransform(railProg, [0,1], [0,1]);

  return (
    <motion.section
      className="py-20 sm:py-24"
      onViewportEnter={() => setActiveSection(3)}
      viewport={{ amount: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-12">
          My UX Journey
        </motion.h2>

        <div ref={railRef} className="relative space-y-12">
          {/* static outer rail */}
          <div className="absolute left-1.5 md:left-2 top-0 bottom-0 w-1 rounded-full bg-[linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.12))]" />
          {/* animated inner rail */}
          <motion.div
            className="absolute left-[9px] md:left-[13px] top-0 w-0.5 origin-top
                       bg-[linear-gradient(180deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] opacity-80"
            style={{ scaleY: fillScale, height: '100%' }}
          />

          {journey.map((item, idx) => (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="relative pl-10 md:pl-14"
            >
              {/* pin (gentle pulse once) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: [0.8,1.04,1], opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, times: [0,0.6,1] }}
                className="absolute left-0 top-2 w-4 h-4 md:w-5 md:h-5 rounded-full
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           ring-4 ring-white/80 shadow-[0_6px_18px_rgba(0,0,0,.18)]"
              />

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.7)] shadow-md hover:shadow-lg transition-shadow"
              >
                <motion.span
                  initial={{ x: -6, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="inline-flex items-center px-5 py-2 rounded-full text-base md:text-lg font-bold
                             shadow-md ring-1 ring-white/50
                             bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white"
                >
                  {item.year}
                </motion.span>

                <h3 className="mt-3 text-xl font-bold text-[hsl(var(--foreground))]">{item.title}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: WARM_BROWN }}>{item.company}</p>
                <p style={{ color: WARM_BROWN }}>{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

/* ---------- Small components ---------- */

const ProofChip = ({ icon, label, sub }) => (
  <motion.li
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.25 }}
    className="rounded-xl px-4 py-3 border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card))]
               shadow-sm flex items-start gap-3 hover:shadow-md transition"
  >
    <span className="mt-0.5 text-[hsl(var(--primary))]">{icon}</span>
    <div>
      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{label}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground)/0.9)]">{sub}</p>
    </div>
  </motion.li>
);

export default AboutPage;
