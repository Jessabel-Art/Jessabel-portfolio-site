import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { projects as allProjects } from '@/data/projects';

/** Local cover fallbacks by slug/id/title key */
const COVER_MAP = {
  'sanchez-services': '/assets/projects/sanchez-cover-1600x1200.jpg',
  'santos-3d-customs': '/assets/projects/santos3d-cover-1600x1200.jpg',
  'itsfaceart': '/assets/projects/itsfaceart-cover-1600x1200.jpg',
};

const keyFromProject = (p = {}) =>
  (p.slug || p.id || p.title || '').toString().toLowerCase().replace(/\s+/g, '-');

/** Placeholder generator as last resort */
const placeholder = (i) => `https://picsum.photos/seed/folio-${i + 1}/1200/800`;

const PortfolioPage = () => {
  const location = useLocation();
  const qp = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Feature flag to hide portfolio (default hidden)
  const envShow = String(import.meta.env?.VITE_SHOW_PORTFOLIO || '').toLowerCase() === 'true';
  const qsPreview = qp.get('preview') === '1';
  const SHOW_PORTFOLIO = envShow || qsPreview;

  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Design' },
    { id: 'branding', label: 'Branding' },
    { id: 'ux', label: 'UX/UI Design' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? allProjects
      : allProjects.filter((project) => project.category === activeFilter);

  // Stronger, consistent contrast for tag pills (same as About)
  const pillClass = (label = '') => {
    const t = String(label).toLowerCase();
    const primary = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm';
    const secondary = 'bg-[hsl(var(--secondary))] text-white shadow-sm';
    const accent = 'bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm';
    const neutral = 'bg-[hsl(var(--foreground))/0.08] text-[hsl(var(--foreground))]';
    if (['ux', 'ui', 'react', 'figma', 'tailwind', 'prototype', 'prototyping', 'design systems'].includes(t)) return primary;
    if (['research', 'user research', 'testing'].includes(t)) return secondary;
    if (['branding', 'identity', 'e-commerce', 'portfolio'].includes(t)) return accent;
    return neutral;
  };

  /** Resilient hero resolver: project.heroImage → COVER_MAP → placeholder */
  const heroFor = (project, index) => {
    const key = keyFromProject(project);
    if (project?.heroImage && project.heroImage.trim().length > 0) return project.heroImage;
    if (key && COVER_MAP[key]) return COVER_MAP[key];
    return placeholder(index);
  };

  // ---------- HIDDEN STATE ----------
  if (!SHOW_PORTFOLIO) {
    return (
      <div className="py-20">
        <Helmet>
          <title>Portfolio — Jessabel.Art</title>
          {/* Keep this page out of search results while hidden */}
          <meta name="robots" content="noindex, nofollow" />
          <meta
            name="description"
            content="Portfolio is currently being refreshed. Check back soon for new case studies."
          />
        </Helmet>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--foreground))]">
            Portfolio <span className="gradient-text">Refresh</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[hsl(var(--muted-foreground))]">
            I’m giving this space a fresh coat of paint. In the meantime, you can
            browse a detailed case study or reach out for a private walkthrough.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="btn-primary rounded-full px-6">
              <Link to="/portfolio/full-sail">
                View Full Sail Case Study
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/contact">Request a project reel</Link>
            </Button>
          </div>

          {/* Optional hint for you: add ?preview=1 to see the grid locally */}
          <p className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">
            (Owner note: append <code>?preview=1</code> to preview this page without changing envs.)
          </p>
        </motion.section>
      </div>
    );
  }

  // ---------- VISIBLE STATE ----------
  return (
    <div className="py-20">
      <Helmet>
        <title>Portfolio - Jessabel.Art</title>
        <meta
          name="description"
          content="Explore a selection of UX design, branding, and web development projects by Jessabel Santos."
        />
        {/* Remove noindex when visible */}
      </Helmet>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--foreground))]">
          My <span className="gradient-text">Portfolio</span>
        </h1>
        <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          A selection of projects where I’ve helped businesses connect with their audiences through design.
        </p>
      </motion.section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((category) => {
            const active = activeFilter === category.id;
            return (
              <Button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                variant="ghost"
                aria-pressed={active}
                className={`rounded-full transition-all duration-300 px-4
                  ${
                    active
                      ? 'bg-[hsl(var(--accent))] text-[#0B0F1A] border border-[hsl(var(--accent))] shadow-sm'
                      : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--foreground))/0.06] hover:text-[hsl(var(--foreground))]'
                  }`}
              >
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const key = project.id || project.slug || index;
              const href = `/portfolio/${project.id || project.slug || index}`;
              const hero = heroFor(project, index);
              const cardId = `proj-${key}-title`;

              return (
                <motion.article
                  key={key}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ y: -8 }}
                  className="rounded-2xl overflow-hidden group border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm hover:shadow-md ring-1 ring-transparent hover:ring-[hsl(var(--accent))]/70 transition-all transform-gpu will-change-transform"
                >
                  <Link to={href} aria-labelledby={cardId}>
                    {/* Media */}
                    <figure className="relative aspect-video bg-[hsl(var(--muted))/0.2]">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={`${project.title} project showcase`}
                        src={hero}
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = placeholder(index);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))/0.55] via-transparent to-transparent pointer-events-none" />
                      {project?.category && (
                        <figcaption
                          className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full
                                     bg-[hsl(var(--secondary))] text-white shadow-sm"
                        >
                          {project.category === 'web' ? 'Web' :
                           project.category === 'ux' ? 'UX/UI' :
                           project.category === 'branding' ? 'Branding' : 'Project'}
                        </figcaption>
                      )}
                    </figure>

                    {/* Body */}
                    <div className="p-6">
                      <h3 id={cardId} className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] mb-4">
                        {project.shortDescription}
                      </p>

                      {/* Tag pills */}
                      {Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tags.map((t) => (
                            <span
                              key={t}
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${pillClass(t)}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="inline-flex items-center font-semibold text-[hsl(var(--foreground))] group-hover:gradient-text transition-colors">
                        View Case Study
                        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-[hsl(var(--muted-foreground))]">No projects found for this filter.</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default PortfolioPage;

