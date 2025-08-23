import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, Sparkles } from 'lucide-react';

// Local assets (adjust paths if needed)
import artistPortrait from '@/assets/about/artist-portrait.png';
import toolsStatsBg from '@/assets/about/tools-stats-bg-strip.jpg';

const WARM_BROWN = 'var(--warm-brown-hex)';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.3 },
};

const skills = [
  'UX Research', 'UI Design', 'Prototyping', 'Design Systems',
  'Figma', 'Information Architecture', 'Heuristic Evaluation',
  'Usability Testing', 'Brand Systems', 'Accessibility (WCAG)',
  'React/Tailwind', 'Analytics'
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
    description: 'Mapped studio zones, supported build‑out decisions, and showed my first public work.' }
];

const education = [
  { school: 'Western Governors University', degree: 'MBA (in progress)', year: '2025' },
  { school: 'Western Governors University', degree: 'B.S. Business Administration, Management', year: '2024' },
  { school: 'Full Sail University', degree: 'Certificate in User Experience', year: '2024' },
  { school: 'Community College of Rhode Island', degree: 'A.S. Business Administration', year: '2022' },
];

const AboutPage = () => {
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jessabel',
    jobTitle: 'UX Designer',
    url: 'https://jessabel.art/about',
    sameAs: [
      'https://www.linkedin.com/', // add your profile
      'https://www.behance.net/'   // add your profile
    ],
    knowsAbout: [
      'User Experience', 'User Interface', 'User Research', 'Usability Testing',
      'Design Systems', 'Figma', 'Accessibility', 'Information Architecture'
    ]
  };

  return (
    <div className="py-20 space-y-24 md:space-y-32">
      <Helmet>
        <title>Jessabel — UX Designer | About</title>
        <meta
          name="description"
          content="Jessabel — UX Designer focused on human-centered, data-informed product design. View case studies, resume, and process."
        />
        <script type="application/ld+json">{JSON.stringify(personLd)}</script>
      </Helmet>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <motion.div {...fadeIn} className="lg:col-span-3 space-y-7 max-w-3xl">
            <h1
              className="
                font-hero font-extrabold tracking-tight
                text-4xl md:text-5xl lg:text-6xl leading-[1.12]
                bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff),var(--btn-teal,#00c2b2))]
                bg-clip-text text-transparent
              "
              style={{ textShadow: '0 6px 22px rgba(0,0,0,0.22)' }}
            >
              I turn complex ideas into intuitive, human‑centered experiences.
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
              I bridge <strong>business strategy</strong>, <strong>user research</strong>, and
              <strong> design systems</strong> to ship products that are beautiful, usable, and measurable.
              My background across business and ops means I design for both <em>people</em> and
              <em> outcomes</em>.
            </p>

            {/* Proof chips */}
            <ul className="grid sm:grid-cols-3 gap-3">
              <ProofChip icon={<CheckCircle size={18} />} label="Human‑centered" sub="Clear, inclusive flows" />
              <ProofChip icon={<BarChart3 size={18} />} label="Data‑informed" sub="Decisions & metrics" />
              <ProofChip icon={<Sparkles size={18} />} label="Systems + UI" sub="Design systems & craft" />
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="h-11 font-semibold text-white shadow-lg
                  bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                  focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Link to="/portfolio">View Case Studies</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Link to="/contact">Contact Me</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <a href="/resume.pdf" target="_blank" rel="noreferrer">Download Resume</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <img
              className="w-full h-auto object-cover rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,.18)]
                         border border-[hsl(var(--border)/0.7)] ring-1 ring-white/40 bg-[hsl(var(--muted))/0.2]"
              alt="Jessabel — portrait"
              src={artistPortrait}
              width={860}
              height={1080}
              loading="lazy"
              fetchpriority="high"
              decoding="async"
            />
          </motion.div>
        </div>
      </section>

      {/* STORY + EDUCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div {...fadeIn} className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))]">A practical path into UX</h2>
            <p className="text-lg leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
              I started in business and people operations, where I saw how clunky tools waste time.
              That’s what led me to UX—combining <strong>analytical problem‑solving</strong> with
              <strong> creative design</strong>. Today, I run projects end‑to‑end: from research and
              information architecture to prototyping and visual design.
            </p>
            <p className="text-lg leading-relaxed max-w-prose" style={{ color: WARM_BROWN }}>
              I’ve shipped client portals, onboarding flows, and internal tools that reduce friction
              for non‑technical teams. I care about evidence, inclusivity, and craft—because details
              are how we earn trust.
            </p>
          </motion.div>

          {/* Education two‑column grid */}
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
      </section>

      {/* SKILLS — full-width glass overlay for heading + pills */}
      <section
        className="relative py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${toolsStatsBg})` }}
      >
        {/* subtle vignette over the photo */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_400px_at_15%_20%,rgba(0,0,0,.14),transparent_60%),radial-gradient(900px_400px_at_85%_60%,rgba(0,0,0,.14),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* one big glass panel that includes the heading and all pills */}
          <motion.div
            {...fadeIn}
            className="mx-auto w-full md:w-[92%] lg:w-[88%] rounded-[22px] md:rounded-[26px]
                       border border-white/45 bg-white/18 backdrop-blur-lg shadow-[0_24px_60px_rgba(0,0,0,.22)]
                       px-5 sm:px-8 py-8 sm:py-10"
            aria-label="Skill toolkit"
          >
            <h2
              className="text-3xl md:text-4xl font-extrabold text-center mb-7 md:mb-8"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              What I work with
            </h2>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
              {skills.map((s) => (
                <li key={s} className="flex">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* UX JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-12">
          My UX Journey
        </motion.h2>

        <motion.div {...fadeIn} className="relative space-y-12">
          <div className="absolute left-1.5 md:left-2 top-0 bottom-0 w-1 rounded-full
            bg-[linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.12))]" />
          <div className="absolute left-[9px] md:left-[13px] top-0 bottom-0 w-0.5
            bg-[linear-gradient(180deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] opacity-60" />

          {journey.map((item) => (
            <div key={`${item.year}-${item.title}`} className="relative pl-10 md:pl-14">
              <div className="absolute left-0 top-2 w-4 h-4 md:w-5 md:h-5 rounded-full
                bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                ring-4 ring-white/80 shadow-[0_6px_18px_rgba(0,0,0,.18)]" />

              <div className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.7)] shadow-md hover:shadow-lg transition-shadow">
                <span className="inline-flex items-center px-5 py-2 rounded-full text-base md:text-lg font-bold
                  shadow-md ring-1 ring-white/50
                  bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white">
                  {item.year}
                </span>

                <h3 className="mt-3 text-xl font-bold text-[hsl(var(--foreground))]">{item.title}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: WARM_BROWN }}>{item.company}</p>
                <p style={{ color: WARM_BROWN }}>{item.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* PROCESS CTA — background & overlay removed (inherits page colors) */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-10 -mb-1">
        <div
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px]
                     border border-[hsl(var(--border)/0.7)] bg-transparent"
        >
          {/* content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16">
            <motion.div {...fadeIn} className="mx-auto max-w-3xl">
              <h2
                className="
                  text-4xl md:text-5xl font-extrabold
                  bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                  bg-clip-text text-transparent
                "
              >
                Curious about my process?
              </h2>

              <p className="mt-3 text-xl md:text-2xl text-[hsl(var(--foreground))]">
                See how I approach projects from discovery to launch.
              </p>

              <div className="mt-6">
                <Button asChild size="lg" className="rounded-full px-6 h-11 font-semibold text-white btn-primary">
                  <Link to="/process">View My UX Process</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* bottom separator that blends into the navy footer */}
        <svg
          className="absolute -bottom-1 left-0 right-0 w-full text-[#0B0F1A]"
          viewBox="0 0 1440 20"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L1440,20 L0,20 Z" fill="currentColor" />
        </svg>
      </section>
    </div>
  );
};

/* -------- Small components -------- */

const ProofChip = ({ icon, label, sub }) => (
  <li className="rounded-xl px-4 py-3 border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card))]
                 shadow-sm flex items-start gap-3">
    <span className="mt-0.5 text-[hsl(var(--primary))]">{icon}</span>
    <div>
      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{label}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground)/0.9)]">{sub}</p>
    </div>
  </li>
);

export default AboutPage;
