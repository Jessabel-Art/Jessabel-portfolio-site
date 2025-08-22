import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Layers, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// 🖼️ Local assets (placed in: /src/assets/about/)
import artistPortrait from '@/assets/about/artist-portrait.png'; // change ext if needed
import toolsStatsBg from '@/assets/about/tools-stats-bg-strip.jpg'; // change ext if needed

const AboutPage = () => {
  const journey = [
    { year: '2022–Present', title: 'UX/UI Designer & Consultant', description: 'Partnering with small businesses and startups on web design, branding, and UX consulting.', company: 'Creative & Tech Sector' },
    { year: '2018–2022', title: 'Systems Implementation Lead', description: 'Led rollout of an internal platform with a focus on usability, accessibility, and streamlined navigation.', company: 'Healthcare SaaS' },
    { year: '2015–2018', title: 'Platform Usability Contributor', description: 'Helped define features, ran usability tests, and improved workflow efficiency across teams.', company: 'Fintech / Insurance' },
    { year: '2014', title: 'The Spark', description: 'Started designing websites for startups, self-teaching SEO, and falling in love with user-focused digital experiences.', company: 'Independent' },
    {
      year: '2011',
      title: 'Design Intern — NUA on the Move',
      company: 'New Urban Arts',
      description:
        'Selected for the studio relocation initiative to plan and test the layout of the new space. I mapped zones for different art disciplines and supported build-out decisions; I also showcased my own work (poetry and realistic portraits). It was my first experience as part of a project team.'
    },
  ];

  // ✨ Tools list now includes GitHub / WordPress / Framer
  const skills = [
    'UX','UI','User Research','Prototyping','Figma','Design Systems',
    'Branding','Identity','SEO','React','Tailwind',
    'GitHub','WordPress','Framer'
  ];

  const pillClass = (label = '') => {
    const t = label.toLowerCase();
    const primary = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm';
    const secondary = 'bg-[hsl(var(--secondary))] text-white shadow-sm';
    const accent = 'bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm';
    const neutral = 'bg-[hsl(var(--foreground))/0.08] text-[hsl(var(--foreground))]';
    if (['ux','user research','research'].includes(t)) return secondary;
    if (['ui','figma','prototyping','design systems','react','tailwind','github','framer','wordpress'].includes(t)) return primary;
    if (['branding','identity','seo'].includes(t)) return accent;
    return neutral;
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.3 },
  };

  /**
   * 🔎 Collage (Design Footprints)
   * Auto-imports files named: collage-about-me-*.{jpg,jpeg,png,webp}
   * Path: /src/assets/projects
   * Ensures stable order by filename.
   */
  const collageModules = import.meta.glob(
    '@/assets/projects/collage-about-me-*.{jpg,jpeg,png,webp}',
    { eager: true, as: 'url' }
  );
  const collage = Object.entries(collageModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

  return (
    <div className="py-20 space-y-24 md:space-y-32">
      <Helmet>
        <title>My Story in Color — Jessabel.Art</title>
        <meta
          name="description"
          content="My story in color: how I blend strategy, bold visuals, and human-centered design to craft usable, beautiful experiences."
        />
      </Helmet>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <motion.div {...fadeIn} className="lg:col-span-3 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--foreground))]">
              My Story in Color
            </h1>
            <div className="space-y-6 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
              <p>
                With a background in business and a love for problem solving, I design digital experiences that feel bold and human. I’ve worked across healthcare, finance, and HR, which gives me a clear view of how technology can support people in complex systems.
              </p>
              <p>
                My first taste of collaborative design was in <strong>2011</strong> during an internship at <strong>New Urban Arts</strong> for <em>NUA on the Move</em>. Our team planned the layout for a new studio so different art disciplines had the space and flow they needed. I also exhibited my own pieces, which taught me how environment, audience, and craft intersect. Today I help founders and teams stand out by blending formal training, 15+ years of experience, and a curiosity for what makes an interface feel right.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="lg:col-span-2">
            {/* If you exported a short looping video instead, replace <img> with a <video> tag */}
            <img
              className="w-full h-auto object-cover rounded-2xl shadow-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.2]"
              alt="Abstract artist portrait illustration"
              src={artistPortrait}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </section>

      {/* Journey + Education (side-by-side on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* LEFT: Experience Timeline */}
          <motion.div {...fadeIn} className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-12 text-center lg:text-left">
              My Professional Journey
            </h2>
            <div className="relative space-y-12">
              <div className="absolute left-1/2 lg:left-[calc(33.333%-0.25rem)] lg:translate-x-0 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[hsl(var(--primary))/0.25] to-[hsl(var(--secondary))/0.25] rounded-full" />
              {journey.map((item, index) => (
                <motion.div
                  key={`${item.year}-${item.title}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className={`flex items-center w-full ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full lg:w-2/3 ${index % 2 === 0 ? 'pr-8 lg:text-right' : 'pl-8 text-left'}`}>
                    <div className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md hover:shadow-lg transition-shadow relative">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--accent))] text-[#0B0F1A] ring-1 ring-[hsl(var(--accent))/0.5] ${index % 2 === 0 ? 'lg:absolute lg:-right-3 lg:-top-3' : 'lg:absolute lg:-left-3 lg:-top-3'}`}>
                        {item.year}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-[hsl(var(--foreground))]">{item.title}</h3>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm font-semibold mb-3">{item.company}</p>
                      <p className="text-[hsl(var(--muted-foreground))]">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Education Block */}
          <motion.aside {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="lg:col-span-1">
            <div className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md">
              <h3 className="text-3xl font-['Playfair_Display'] italic text-[hsl(var(--foreground))] mb-4">
                Education
              </h3>

              {/* Horizontal mini‑timeline */}
              <div className="relative my-6">
                <div className="absolute left-0 right-0 top-4 h-1 bg-[var(--orange-800,#d74708)]/70 rounded-full" />
                <ul className="relative grid grid-cols-4 gap-2">
                  {[
                    { short:'CCRI', school:'Community College of Rhode Island', degree:'Associate of Science in Business Administration', year:'2022' },
                    { short:'WGU', school:'Western Governors University', degree:'Bachelor of Science in Business Administration Management', year:'2024' },
                    { short:'WGU', school:'Western Governors University', degree:'Master of Business Administration', year:'2025' },
                    { short:'Full Sail', school:'Full Sail University', degree:'Certificate in User Experience', year:'2024' },
                  ].map((e) => (
                    <li key={e.short} className="text-center">
                      <div className="mx-auto w-6 h-6 rounded-full border-2 border-black bg-[var(--orange-600,#fa8a00)] shadow" />
                      <p className="mt-3 text-xs font-semibold text-[hsl(var(--foreground))]">{e.school}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{e.degree}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">{e.year}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Round Case Study button */}
              <div className="flex justify-center mt-8">
                <Link
                  to="/portfolio/full-sail"
                  className="inline-flex items-center justify-center w-40 h-40 rounded-full text-center font-semibold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--btn-pink,#ff3ea5), var(--btn-teal,#00c2b2))' }}
                  aria-label="View Education Case Study"
                  title="View Education Case Study"
                >
                  View Full Sail Cert Case Study
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* Skills marquee + Stats with abstract background strip */}
      <section
        className="py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${toolsStatsBg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <motion.div {...fadeIn} className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center lg:text-left drop-shadow">
                What I Work With
              </h2>
              <div className="hidden motion-reduce:flex flex-wrap justify-center gap-3">
                {skills.map((s) => (
                  <span key={s} className={`text-sm px-3 py-1.5 rounded-full font-semibold ${pillClass(s)}`}>{s}</span>
                ))}
              </div>
              <div className="motion-safe:block hidden">
                <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_96px,_black_calc(100%-96px),transparent_100%)]">
                  <ul className="flex items-center gap-3 animate-infinite-scroll">
                    {[...skills, ...skills].map((s, i) => (
                      <li key={`${s}-${i}`} className="shrink-0">
                        <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${pillClass(s)}`}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.ul {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="grid grid-cols-1 gap-4">
              <li className="rounded-2xl p-5 bg-[rgba(255,255,255,0.9)] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] shadow-sm flex items-start gap-3 backdrop-blur">
                <Layers className="mt-1" />
                <div>
                  <p className="text-3xl font-extrabold leading-none">15 yrs</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Design & ops experience</p>
                </div>
              </li>
              <li className="rounded-2xl p-5 bg-[rgba(255,255,255,0.9)] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] shadow-sm flex items-start gap-3 backdrop-blur">
                <Users className="mt-1" />
                <div>
                  <p className="text-3xl font-extrabold leading-none">5+</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Industries served</p>
                </div>
              </li>
              <li className="rounded-2xl p-5 bg-[rgba(255,255,255,0.9)] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] shadow-sm flex items-start gap-3 backdrop-blur">
                <Award className="mt-1" />
                <div>
                  <p className="text-3xl font-extrabold leading-none">100%</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Client-first approach</p>
                </div>
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Design Footprints (collage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeIn}>
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">Design Footprints</h2>

          {/* Mobile: uniform cards */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {collage.slice(0, 8).map((src, i) => (
              <CollageImg key={i} src={src} className="aspect-[4/3]" />
            ))}
          </div>

          {/* Desktop: balanced quilt (no overpowering tall tiles) */}
          <div className="hidden md:grid grid-cols-12 gap-4">
            {collage.map((src, i) => {
              // Alternate spans & aspect to keep visual rhythm
              const isWide = i % 3 !== 0; // 2/3 of tiles wide(ish)
              const colClass = isWide ? 'col-span-4' : 'col-span-3';
              const aspect = isWide ? 'aspect-[4/3]' : 'aspect-[3/4]';
              return (
                <div key={i} className={`${colClass}`}>
                  <CollageImg src={src} className={`${aspect} max-h-[260px]`} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-4">Curious about my process?</h2>
            <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-2xl mx-auto">See how I approach projects from discovery to launch.</p>
            <Button asChild size="lg" className="btn-primary">
              <Link to="/process">View My UX Process</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const CollageImg = ({ src, className = '' }) => (
  <div className={`w-full overflow-hidden rounded-xl border border-[hsl(var(--border))] shadow-sm bg-[hsl(var(--muted))/0.2] ${className}`}>
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = 'https://picsum.photos/seed/fallbackja/1600/1200';
      }}
    />
  </div>
);

export default AboutPage;



