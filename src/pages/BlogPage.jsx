import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, User, Tag, Search as SearchIcon, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* ==================== Styles ==================== */
const grad =
  'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white font-semibold shadow-lg';
const outline = 'border border-[hsl(var(--border))]';
const ghostBtn =
  'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]';

const keyFor = (p) => p.slug ?? p.id;
const imgFor = (p) => p.cover || p.heroImage || '';

/* ==================== Sparkle utilities ==================== */
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
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[hsl(var(--primary))]">
              <path fill="currentColor" d="M12 2l1.6 4.7L18 8.4l-4.2 2.9L14.8 16 12 13.7 9.2 16l1-4.7L6 8.4l4.4-1.7L12 2z" />
            </svg>
          </motion.span>
        );
      })}
    </motion.span>
  );
};

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

/* ==================== Page ==================== */
const BlogPage = ({
  posts = [],
  title = 'All Articles',
  description = 'Insights on UX, UI, and product from Jessabel.Art',
}) => {
  const prefersReducedMotion = useReducedMotion();

  /* Ordering */
  const ordered = useMemo(() => {
    const arr = posts.filter(Boolean);
    const hasDates = arr.some((p) => p.date);
    if (!hasDates) return arr;
    return [...arr].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  }, [posts]);

  /* Search / Tag */
  const allTags = useMemo(() => {
    const t = new Set();
    ordered.forEach((p) => (p.tags || []).forEach((tag) => t.add(tag)));
    return Array.from(t).sort((a, b) => a.localeCompare(b));
  }, [ordered]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter((p) => {
      const matchesQ =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (p.category || '').toLowerCase().includes(q);
      const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
      return matchesQ && matchesTag;
    });
  }, [ordered, query, activeTag]);

  /* Hover state for sparkle buttons */
  const [btnHover, setBtnHover] = useState({ clear: false, read: {}, copy: {}, footer: false });

  return (
    <div className="py-20 bg-[#FAFAF7]">
      <Helmet>
        <title>Blog - Jessabel.Art</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://jessabel.art/blog" />
        <meta property="og:title" content="Blog - Jessabel.Art" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))]">{title}</h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">{description}</p>
          </div>

          {/* Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="pl-9 focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))]"
                aria-label="Search articles"
              />
            </div>
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant="ghost"
              className={activeTag ? ghostBtn : `${grad}`}
              onClick={() => setActiveTag(null)}
            >
              All
            </Button>
            {allTags.map((t) => (
              <motion.span key={t} whileHover={{ y: -1 }}>
                <Button
                  variant="ghost"
                  className={activeTag === t ? grad : ghostBtn}
                  onClick={() => setActiveTag(t === activeTag ? null : t)}
                >
                  <Tag size={14} className="mr-2" />
                  {t}
                </Button>
              </motion.span>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center relative overflow-hidden">
            {!prefersReducedMotion && (
              <motion.span
                className="pointer-events-none absolute inset-0 opacity-20"
                initial={{ x: '-120%' }}
                animate={{ x: ['-120%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.8), transparent)' }}
              />
            )}
            <p className="relative text-[hsl(var(--muted-foreground))]">No articles found. Try a different search or tag.</p>
            <div className="relative mt-4 inline-block" onMouseEnter={() => setBtnHover((s) => ({ ...s, clear: true }))} onMouseLeave={() => setBtnHover((s) => ({ ...s, clear: false }))}>
              <Button
                onClick={() => {
                  setQuery('');
                  setActiveTag(null);
                }}
                variant="outline"
                className={`${outline} hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition`}
              >
                Clear filters
              </Button>
              <SparkleOverlay active={btnHover.clear} />
            </div>
          </div>
        )}

        {/* Grid of posts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, idx) => {
            const href = `/blog/${keyFor(p)}`;
            const img = imgFor(p);
            const dateStr =
              p.date &&
              new Date(p.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

            const readHoverKey = `read-${idx}`;
            const copyHoverKey = `copy-${idx}`;

            return (
              <motion.article
                key={String(keyFor(p))}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -4, boxShadow: '0 24px 50px -24px rgba(0,0,0,.25)' }}
                className="group rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-shadow flex flex-col"
              >
                {/* Cover */}
                <Link to={href} className="relative block aspect-video bg-[hsl(var(--muted))/0.2] overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={p.coverAlt || p.heroAlt || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-[linear-gradient(135deg,#fa8a00,#fec200)]" />
                  )}
                  {!prefersReducedMotion && (
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {p.category && (
                    <span className="text-2xs font-semibold bg-[hsl(var(--secondary))] text-white inline-block px-2 py-0.5 rounded-full mb-2 capitalize">
                      {p.category}
                    </span>
                  )}

                  <LinkWithSparkle to={href} className="block">
                    <h2 className="text-xl font-bold text-[hsl(var(--foreground))] [text-decoration-thickness:2px]">
                      {p.title}
                    </h2>
                  </LinkWithSparkle>

                  {p.excerpt && (
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                      {p.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-3 text-xs text-[hsl(var(--muted-foreground))] flex flex-wrap items-center gap-x-4 gap-y-1">
                    {p.author && (
                      <span className="inline-flex items-center gap-1.5">
                        <User size={14} /> {p.author}
                      </span>
                    )}
                    {dateStr && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} /> {dateStr}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {Array.isArray(p.tags) && p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[hsl(var(--foreground))/0.08] text-[hsl(var(--foreground))]"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--foreground))/0.06]">
                          +{p.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-[hsl(var(--border))]">
                    {/* Read button with sweep & sparkles */}
                    <span
                      className="relative inline-block"
                      onMouseEnter={() => setBtnHover((s) => ({ ...s, read: { ...s.read, [readHoverKey]: true } }))}
                      onMouseLeave={() => setBtnHover((s) => ({ ...s, read: { ...s.read, [readHoverKey]: false } }))}
                    >
                      <Button asChild className={`${grad} relative overflow-hidden`}>
                        <Link to={href} className="inline-flex items-center gap-2">
                          Read article <ArrowRight size={16} />
                        </Link>
                      </Button>
                      {/* gradient sweep */}
                      {!prefersReducedMotion && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 opacity-30"
                          initial={{ x: '-110%' }}
                          animate={{ x: btnHover.read[readHoverKey] ? '110%' : '-110%' }}
                          transition={{ duration: 1.8, ease: 'easeInOut' }}
                          style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                        />
                      )}
                      <SparkleOverlay active={!!btnHover.read[readHoverKey]} />
                    </span>

                    {/* Copy link button with accent fill on hover + sparkles */}
                    <span
                      className="relative inline-block"
                      onMouseEnter={() => setBtnHover((s) => ({ ...s, copy: { ...s.copy, [copyHoverKey]: true } }))}
                      onMouseLeave={() => setBtnHover((s) => ({ ...s, copy: { ...s.copy, [copyHoverKey]: false } }))}
                    >
                      <Button
                        variant="outline"
                        className={`${outline} transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const absolute = window.location.origin + href;
                          window.navigator.clipboard?.writeText(absolute);
                        }}
                      >
                        <LinkIcon size={16} className="mr-1" />
                        Copy link
                      </Button>
                      <SparkleOverlay active={!!btnHover.copy[copyHoverKey]} />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Footer helper */}
        <div className="mt-10 text-center">
          <span
            className="relative inline-block"
            onMouseEnter={() => setBtnHover((s) => ({ ...s, footer: true }))}
            onMouseLeave={() => setBtnHover((s) => ({ ...s, footer: false }))}
          >
            <Button asChild variant="outline" className={`${outline} transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`}>
              <Link to="/blog">All Articles</Link>
            </Button>
            <SparkleOverlay active={btnHover.footer} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
