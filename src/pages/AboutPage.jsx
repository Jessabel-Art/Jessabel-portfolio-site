import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Layers, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Local assets
import artistPortrait from '@/assets/about/artist-portrait.png';
import toolsStatsBg from '@/assets/about/tools-stats-bg-strip.jpg';
import processBg from '@/assets/images/process-background.jpg'; // ensure this file exists

// warm brown used sitewide (matches --warm-brown-hex in index.css)
const WARM_BROWN = 'var(--warm-brown-hex)';

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
        'Selected for the studio relocation initiative to plan and test the layout of the new space. I mapped zones for different art disciplines and supported build-out decisions; I also showcased my own work (poetry and realistic portraits). It was my first experience as part of a project team.',
    },
  ];

  // Reverse chronological
  const education = [
    { school: 'Western Governors University', degree: 'MBA (in progress)', year: '2025' },
    { school: 'Western Governors University', degree: 'B.S. Business Administration, Management', year: '2024' },
    { school: 'Full Sail University', degree: 'Certificate in User Experience', year: '2024' },
    { school: 'Community College of Rhode Island', degree: 'A.S. Business Administration', year: '2022' },
  ];

  const skills = [
    'UX', 'UI', 'User Research', 'Prototyping', 'Figma', 'Design Systems',
    'Branding', 'Identity', 'SEO', 'React', 'Tailwind', 'GitHub', 'WordPress', 'Framer',
  ];

  const pillClass = (label = '') => {
    const t = label.toLowerCase();
    const primary = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm';
    const secondary = 'bg-[hsl(var(--secondary))] text-white shadow-sm';
    const accent = 'bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm';
    const neutral = 'bg-[hsl(var(--foreground))/0.08] text-[hsl(var(--foreground))]';
    if (['ux', 'user research', 'research'].includes(t)) return secondary;
    if (['ui', 'figma', 'prototyping', 'design systems', 'react', 'tailwind', 'github', 'framer', 'wordpress'].includes(t)) return primary;
    if (['branding', 'identity', 'seo'].includes(t)) return accent;
    return neutral;
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.3 },
  };

  // Collage (Design Footprints) → single marquee row
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
        <title>About — Jessabel.Art</title>
        <meta
          name="description"
          content="How I blend strategy, bold visuals, and human-centered design to craft usable, beautiful experiences."
        />
      </Helmet>

      {/* Intro + Education */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <motion.div {...fadeIn} className="lg:col-span-3 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--foreground))]">
              My Story in Color
            </h1>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: WARM_BROWN }}>
              <p>
                I didn’t start out calling myself a designer. My roots have always been creative, sketching,
                experimenting with layouts, and bringing ideas to life visually. Long before I knew the term UX existed,
                I was already mapping workflows, reorganizing dashboards, and tweaking web layouts to make things feel smoother.
                At the time, I thought I was just fixing things. In reality, I was building the foundation of user experience.
              </p>
              <p>
                In my early career in HR and operations, I became the person people turned to when systems felt clunky.
                I would draw workflows on paper, sketch intranet structures, or redesign onboarding steps so people could
                actually use the tools in front of them. That drive to make processes more human eventually pulled me
                fully into UX and web design.
              </p>
              <p>
                Outside of corporate roles, I’ve freelanced with small businesses and startups, helping them build branding systems,
                design websites, and shape digital experiences from the ground up. Those projects gave me a front row seat to the
                scrappy side of design. I loved helping a founder translate their vision into a visual identity, crafting user flows
                that welcomed their first customers, and blending brand personality with usability.
              </p>
              <p>
                Today I merge that creative background with more than 15 years of business experience to design solutions that are both
                strategic and bold. I’ve wireframed corporate intranets for 20,000 employees, redesigned onboarding flows that cut errors
                by 40 percent, and crafted customer journeys that aligned startup goals with user needs. Along the way, I earned my MBA
                and a UX certificate from Full Sail University, which deepened both the strategic and creative sides of my toolkit.
              </p>
              <p>
                My design style reflects who I am: colorful, unapologetic, and a little unexpected. I believe good design should spark curiosity
                and feel as natural as conversation. Whether I’m sketching workflows, building a brand system, or prototyping in Figma,
                I bring both the spreadsheet and the sketchbook to the table.
              </p>
            </div>

            {/* Education — concise bullets */}
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Education</h3>
              <ul className="list-disc pl-5 space-y-1" style={{ color: WARM_BROWN }}>
                {education.map((e) => (
                  <li key={`${e.school}-${e.year}`}>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{e.school}</span> — {e.degree}{' '}
                    <span className="opacity-80">({e.year})</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/case-study/full-sail"
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-center font-semibold text-white shadow-lg glow-yellow"
                  style={{ background: 'linear-gradient(135deg, var(--btn-red,#ba0d0d), var(--btn-yellow,#ecdf26))' }}
                >
                  View Full Sail Cert Case Study
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="lg:col-span-2"
          >
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

      {/* Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeIn}>
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-12 text-center lg:text-left">
            My UX Journey
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
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--accent))] text-[#0B0F1A] ring-1 ring-[hsl(var(--accent))/0.5] ${index % 2 === 0 ? 'lg:absolute lg:-right-3 lg:-top-3' : 'lg:absolute lg:-left-3 lg:-top-3'}`}
                    >
                      {item.year}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-[hsl(var(--foreground))]">{item.title}</h3>
                    <p className="text-sm font-semibold mb-3" style={{ color: WARM_BROWN }}>
                      {item.company}
                    </p>
                    <p style={{ color: WARM_BROWN }}>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills + Stats (no full overlay; readable cards on image) */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${toolsStatsBg})` }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <motion.div {...fadeIn} className="lg:col-span-2">
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-center lg:text-left glow-yellow"
                style={{ color: 'hsl(var(--headline-yellow))', textShadow: '0 3px 18px rgba(0,0,0,0.22)' }}
              >
                What I Work With
              </h2>

              {/* One smooth marquee row */}
              {skills.length > 0 && (
                <MarqueeRow
                  items={skills}
                  render={(s) => (
                    <span className={`text-sm px-3 py-1.5 rounded-full font-semibold pill-contrast ${pillClass(s)}`}>{s}</span>
                  )}
                  duration={30}
                />
              )}
            </motion.div>

            {/* Stats — bright “glass” cards for legibility */}
            <motion.ul
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="grid grid-cols-1 gap-4"
            >
              <StatCard icon={<Layers className="mt-1 text-[#0B0F1A]" />} value="15 yrs" label="Design & ops experience" />
              <StatCard icon={<Users className="mt-1 text-[#0B0F1A]" />} value="5+" label="Industries served" />
              <StatCard icon={<Award className="mt-1 text-[#0B0F1A]" />} value="100%" label="Client-first approach" />
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Design Footprints — single marquee row (object-contain to avoid cropping) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeIn}>
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-6 text-center">
            Design Footprints
          </h2>

          {collage.length === 0 ? (
            <p className="text-center" style={{ color: WARM_BROWN }}>Adding samples soon.</p>
          ) : (
            <ImageMarquee images={collage} duration={36} />
          )}
        </motion.div>
      </section>

      {/* CTA: Curious about my process (dark vignette so it pops) */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${processBg})` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.28) 55%, rgba(0,0,0,.35) 100%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn} className="mx-auto max-w-3xl">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'hsl(var(--headline-yellow))', textShadow: '0 4px 22px rgba(0,0,0,0.35)' }}
            >
              Curious about my process?
            </h2>
            <p className="text-xl mb-8" style={{ color: '#ffffff', textShadow: '0 2px 14px rgba(0,0,0,.35)' }}>
              See how I approach projects from discovery to launch.
            </p>
            <Button asChild size="lg" className="btn-primary rounded-full px-6 glow-yellow">
              <Link to="/process">View My UX Process</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* ---------- Small pieces ---------- */

const StatCard = ({ icon, value, label }) => (
  <li
    className="rounded-2xl p-6 md:p-7 text-[#0B0F1A] border border-white/60 shadow-[0_10px_28px_rgba(0,0,0,.12)] flex items-start gap-3 backdrop-blur-md"
    style={{ background: 'rgba(255,255,255,0.90)' }}
  >
    {icon}
    <div>
      <p className="text-[1.9rem] md:text-4xl font-extrabold leading-none">{value}</p>
      <p className="text-sm md:text-base mt-1" style={{ color: WARM_BROWN }}>
        {label}
      </p>
    </div>
  </li>
);

const MarqueeRow = ({ items = [], render, duration = 30 }) => {
  const doubled = [...items, ...items];
  return (
    <div className="w-full overflow-hidden mask-edge-x">
      <ul
        className="flex items-center gap-4 animate-infinite-scroll"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((it, i) => (
          <li key={`${String(it)}-${i}`} className="shrink-0">
            {render(it)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ImageMarquee = ({ images = [], duration = 36 }) => {
  const doubled = [...images, ...images];
  return (
    <div className="w-full overflow-hidden mask-edge-x">
      {/* slightly larger gaps help prevent visual strobing */}
      <ul
        className="flex items-center gap-5 animate-infinite-scroll"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((src, i) => (
          <li key={`${src}-${i}`} className="shrink-0">
            <Tile src={src} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Tile = ({ src }) => (
  <div className="w-[360px] h-[230px] md:w-[440px] md:h-[270px] rounded-xl border border-[hsl(var(--border))] shadow-sm bg-white flex items-center justify-center p-2">
    <img
      src={src}
      alt=""
      className="max-w-full max-h-full object-contain"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = 'https://picsum.photos/seed/fallbackja/1200/800';
      }}
    />
  </div>
);

export default AboutPage;
