import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// styles
const grad =
  'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white font-semibold shadow-lg';
const outline = 'border border-[hsl(var(--border))]';
const ghostBtn =
  'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]';

const keyFor = (p) => p.slug ?? p.id;
const imgFor = (p) => p.cover || p.heroImage || '';

const BlogPage = ({
  posts = [],
  title = 'All Articles',
  description = 'Insights on UX, UI, and product from Jessabel.Art',
}) => {
  // --------- Ordering ----------
  const ordered = useMemo(() => {
    const arr = posts.filter(Boolean);
    const hasDates = arr.some((p) => p.date);
    if (!hasDates) return arr;
    return [...arr].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da; // newest first
    });
  }, [posts]);

  // --------- Search / Tag filter ----------
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
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (p.category || '').toLowerCase().includes(q);
      const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
      return matchesQ && matchesTag;
    });
  }, [ordered, query, activeTag]);

  return (
    <div className="py-20">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="pl-9"
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
              <Button
                key={t}
                variant="ghost"
                className={activeTag === t ? grad : ghostBtn}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
              >
                <Tag size={14} className="mr-2" />
                {t}
              </Button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
            <p className="text-[hsl(var(--muted-foreground))]">No articles found. Try a different search or tag.</p>
            <div className="mt-4">
              <Button
                onClick={() => {
                  setQuery('');
                  setActiveTag(null);
                }}
                variant="outline"
                className={outline}
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}

        {/* Grid of posts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const href = `/blog/${keyFor(p)}`;
            const img = imgFor(p);
            const dateStr =
              p.date &&
              new Date(p.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

            return (
              <article
                key={String(keyFor(p))}
                className="group rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Cover */}
                <Link to={href} className="block aspect-video bg-[hsl(var(--muted))/0.2] overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={p.coverAlt || p.heroAlt || ''}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-[linear-gradient(135deg,#fa8a00,#fec200)]" />
                  )}
                </Link>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {p.category && (
                    <span className="text-2xs font-semibold bg-[hsl(var(--secondary))] text-white inline-block px-2 py-0.5 rounded-full mb-2 capitalize">
                      {p.category}
                    </span>
                  )}

                  <Link to={href} className="block">
                    <h2 className="text-xl font-bold text-[hsl(var(--foreground))] group-hover:underline">
                      {p.title}
                    </h2>
                  </Link>

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
                    <Button asChild className={grad}>
                      <Link to={href} className="inline-flex items-center gap-2">
                        Read article <ArrowRight size={16} />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className={outline}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const absolute = window.location.origin + href;
                        window.navigator.clipboard?.writeText(absolute);
                      }}
                    >
                      Copy link
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer helper */}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className={outline}>
            <Link to="/blog">All Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
