import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight, Clock, Share2, Copy, ListTree, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

/* ==================== Sparkle utilities ==================== */
const SparkleOverlay = ({ active }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} className="pointer-events-none absolute inset-0">
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
    <span className="relative inline-block" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={to} className={`relative inline-flex items-center gap-2 underline decoration-transparent hover:decoration-current transition ${className}`}>
        {children}
      </Link>
      <SparkleOverlay active={hover} />
    </span>
  );
};

const AnchorWithSparkle = ({ href, onClick, children, className = '' }) => {
  const [hover, setHover] = useState(false);
  return (
    <span className="relative inline-block" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <a href={href} onClick={onClick} className={`relative block ${className}`}>{children}</a>
      <SparkleOverlay active={hover} />
    </span>
  );
};

/* ==================== Page ==================== */
const BlogPostPage = ({ posts = [] }) => {
  const prefersReducedMotion = useReducedMotion();

  // Support either /blog/:id or /blog/:postId
  const { id, postId } = useParams();
  const targetId = id ?? postId;

  // ---------- Helpers ----------
  const parseDate = (d) => (d ? new Date(d) : null);
  const keyFor = (p) => (p && (p.slug ?? p.id));
  const grad =
    'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white font-semibold shadow-lg';
  const outline = 'border border-[hsl(var(--border))]';

  // Normalize & order posts (newest first if dates exist)
  const ordered = useMemo(() => {
    const arr = posts.filter(Boolean);
    const hasDates = arr.some((p) => p.date);
    if (!hasDates) return arr;
    return [...arr].sort((a, b) => {
      const da = parseDate(a.date)?.getTime() ?? 0;
      const db = parseDate(b.date)?.getTime() ?? 0;
      return db - da; // newest -> oldest
    });
  }, [posts]);

  // Find the current post robustly (slug OR id)
  const postIndex = useMemo(() => {
    return ordered.findIndex(
      (p) => String(p.id) === String(targetId) || String(p.slug) === String(targetId)
    );
  }, [ordered, targetId]);

  const post = postIndex >= 0 ? ordered[postIndex] : null;
  const prevPost = postIndex > 0 ? ordered[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < ordered.length - 1 ? ordered[postIndex + 1] : null;

  // UI state
  const articleRef = useRef(null);
  const [toc, setToc] = useState([]); // [{id, text, level}]
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  // Reading time
  const readingMinutes = useMemo(() => {
    if (!post) return 1;
    const html = String(post.content || '');
    const text = html.replace(/<[^>]+>/g, ' ') + ' ' + (post.excerpt || '');
    const words = text.trim().split(/\s+/).filter(Boolean).length || 120;
    return Math.max(1, Math.round(words / 200));
  }, [post]);

  const coverUrl = post?.cover || post?.heroImage || null;

  const dateStr =
    post?.date &&
    new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied', description: 'URL copied to your clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Please copy the URL manually.', variant: 'destructive' });
    }
  };

  const handleWebShare = async () => {
    if (!post) return;
    const url = window.location.href;
    const data = { title: post.title, text: post.excerpt || post.title, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* canceled */
      }
    } else {
      handleCopyLink();
    }
  };

  const shareTo = (network) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || 'Article');
    let href = '';
    if (network === 'x') {
      href = `https://x.com/intent/tweet?text=${text}&url=${url}`;
    } else if (network === 'linkedin') {
      href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };

  if (!post) {
    return (
      <div className="py-20 text-center bg-[#FAFAF7]">
        <Helmet>
          <title>Post Not Found - Jessabel.Art</title>
        </Helmet>
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">404 - Post Not Found</h1>
        <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">The article you are looking for does not exist.</p>
        <LinkWithSparkle to="/blog" className="mt-8 text-[hsl(var(--primary))]">
          <ArrowLeft size={16} /> Back to All Articles
        </LinkWithSparkle>
      </div>
    );
  }

  // SEO / social
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    image: coverUrl ? [coverUrl] : undefined,
    mainEntityOfPage: canonical,
  };

  // tag pill styles
  const tagClasses = (rawTag = '') => {
    const t = rawTag.toLowerCase().trim();
    const primary = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm';
    const secondary = 'bg-[hsl(193,100%,50%)] text-white shadow-sm';
    const accent = 'bg-[hsl(var(--accent))] text-[#0B0F1A] shadow-sm';
    const neutral = 'bg-[hsl(var(--foreground))/0.08] text-[hsl(var(--foreground))]';
    if (['ux', 'research', 'user research'].includes(t)) return secondary;
    if (['ui', 'figma', 'prototyping', 'prototype', 'design process'].includes(t)) return primary;
    if (['branding', 'identity', 'marketing', 'brand'].includes(t)) return accent;
    return neutral;
  };

  const sanitizedHtml = String(post.content || '').trim();

  // --- ToC + Anchors + Active Section + Progress ---
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const slugify = (s) =>
      s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    const headings = Array.from(el.querySelectorAll('h2, h3'));
    const tocItems = [];
    const used = new Set();
    headings.forEach((h) => {
      const level = h.tagName.toLowerCase() === 'h3' ? 3 : 2;
      let base = h.id || slugify(h.textContent || '');
      if (!base) return;
      let unique = base;
      let i = 2;
      while (used.has(unique)) unique = `${base}-${i++}`;
      used.add(unique);
      if (!h.id) h.id = unique;
      h.classList.add('scroll-mt-24');
      tocItems.push({ id: unique, text: h.textContent || '', level });
    });
    setToc(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    headings.forEach((h) => observer.observe(h));

    const onScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = doc.scrollTop || body.scrollTop;
      const height = (doc.scrollHeight || body.scrollHeight) - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [sanitizedHtml]);

  return (
    <div className="py-20 bg-[#FAFAF7]">
      <Helmet>
        <title>{post.title} - Jessabel.Art</title>
        <meta name="description" content={post.excerpt} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        {post.excerpt && <meta property="og:description" content={post.excerpt} />}
        {coverUrl && <meta property="og:image" content={coverUrl} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Sticky reading progress (above header) */}
      <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent" style={{ pointerEvents: 'none' }}>
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[260px,1fr] gap-10">
        {/* ToC (desktop) */}
        <aside className="hidden lg:block sticky top-28 self-start">
          {toc.length > 0 && (
            <nav aria-label="Table of contents" className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <div className="flex items-center gap-2 mb-3">
                <ListTree size={16} />
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">On this page</p>
              </div>
              <ul className="space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                    <AnchorWithSparkle
                      href={`#${item.id}`}
                      className={`
                        rounded px-2 py-1 transition-colors
                        ${activeId === item.id
                          ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--foreground))/0.06]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}
                      `}
                    >
                      {item.text}
                    </AnchorWithSparkle>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        {/* Main column */}
        <div>
          {/* Back to All Articles */}
          <div className="mb-8">
            <span className="relative inline-block">
              <Button asChild variant="outline" className={`${outline} rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`}>
                <Link to="/blog" className="inline-flex items-center gap-2">
                  <ArrowLeft size={16} /> All Articles
                </Link>
              </Button>
              <SparkleOverlay active />
            </span>
          </div>

          {/* Hero / Meta band */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-12 rounded-3xl bg-[#FFEFD2] p-5 sm:p-7 md:p-8 overflow-hidden"
          >
            {coverUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-6 bg-[hsl(var(--muted))/0.2]">
                <motion.img
                  src={coverUrl}
                  alt={post.coverAlt || post.heroAlt || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-6 bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
            )}

            {post.category && (
              <p className="text-sm font-semibold bg-[hsl(var(--secondary))] text-white inline-block px-2.5 py-1 rounded-full mb-3 capitalize">
                {post.category}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-3">{post.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-[hsl(var(--muted-foreground))] gap-x-6 gap-y-2">
              {post.author && (
                <span className="inline-flex items-center gap-2">
                  <User size={14} />
                  <span>{post.author}</span>
                </span>
              )}
              {dateStr && (
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{dateStr}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Clock size={14} />
                <span>{readingMinutes} min read</span>
              </span>

              {/* Share */}
              <span className="ml-auto inline-flex items-center gap-2">
                <span className="relative inline-block">
                  <Button size="sm" variant="outline" className="h-8 px-3 rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]" onClick={handleWebShare} title="Share">
                    <Share2 size={14} className="mr-2" />
                    Share
                  </Button>
                  <SparkleOverlay active />
                </span>
                <span className="relative inline-block">
                  <Button size="sm" variant="outline" className="h-8 px-3 rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]" onClick={handleCopyLink} title="Copy link">
                    <Copy size={14} className="mr-2" />
                    Copy
                  </Button>
                  <SparkleOverlay active />
                </span>
              </span>
            </div>

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tagClasses(t)}`}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Mobile ToC */}
          {toc.length > 0 && (
            <div className="lg:hidden mb-6">
              <motion.button
                type="button"
                onClick={() => setTocOpen((v) => !v)}
                className="w-full flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3"
                aria-expanded={tocOpen}
                aria-controls="mobile-toc"
                whileTap={{ scale: 0.98 }}
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <ListTree size={16} /> On this page
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">{tocOpen ? 'Hide' : 'Show'}</span>
              </motion.button>
              <motion.nav
                id="mobile-toc"
                initial={false}
                animate={{ height: tocOpen ? 'auto' : 0, opacity: tocOpen ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                        <AnchorWithSparkle
                          href={`#${item.id}`}
                          onClick={() => setTocOpen(false)}
                          className={`
                            rounded px-2 py-1 transition-colors
                            ${activeId === item.id
                              ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--foreground))/0.06]'
                              : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}
                          `}
                        >
                          {item.text}
                        </AnchorWithSparkle>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.nav>
            </div>
          )}

          {/* Content (wrapped in a readable card) */}
          {sanitizedHtml ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 shadow-sm"
            >
              <article
                ref={articleRef}
                className="
                  prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:scroll-mt-24
                  prose-headings:text-[hsl(var(--foreground))]
                  prose-p:text-[hsl(var(--muted-foreground))]
                  prose-a:text-[hsl(var(--primary))] hover:prose-a:no-underline
                  prose-strong:text-[hsl(var(--foreground))]
                  prose-table:border prose-table:border-[hsl(var(--border))]
                  prose-th:border prose-td:border
                  prose-hr:border-[hsl(var(--border))]
                  prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-[hsl(var(--muted-foreground))]
                  prose-li:marker:text-[hsl(var(--primary))]
                "
                // Ensure post.content is sanitized HTML upstream
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.div>
          ) : (
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <p className="text-[hsl(var(--muted-foreground))]">
                This article is coming soon. Check back shortly!
              </p>
            </div>
          )}

          {/* Prev / Next */}
          <div className="mt-16 pt-8 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-stretch sm:items-center">
            {prevPost ? (
              <motion.span whileHover={{ y: -2 }} className="inline-block">
                <Button asChild variant="outline" className={`${outline} rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`}>
                  <Link to={`/blog/${keyFor(prevPost)}`} className="flex items-center gap-2">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Previous:</span> {prevPost.title}
                  </Link>
                </Button>
              </motion.span>
            ) : (
              <span />
            )}

            {nextPost ? (
              <span className="relative inline-block">
                <motion.span whileHover={{ y: -2, boxShadow: '0 18px 40px -20px rgba(0,0,0,.25)' }} className="inline-block">
                  <Button asChild className={`${grad} rounded-full relative overflow-hidden`}>
                    <Link to={`/blog/${keyFor(nextPost)}`} className="flex items-center gap-2">
                      <span className="hidden sm:inline">Next:</span> {nextPost.title}
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </motion.span>
                {/* gradient sweep + sparkles */}
                {!prefersReducedMotion && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 opacity-30"
                    initial={{ x: '-110%' }}
                    whileHover={{}}
                    animate={{ x: ['-110%', '110%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                  />
                )}
                <SparkleOverlay active />
              </span>
            ) : (
              <span className="relative inline-block">
                <motion.span whileHover={{ y: -2 }} className="inline-block">
                  <Button asChild variant="outline" className={`${outline} rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`}>
                    <Link to="/blog" className="flex items-center gap-2">
                      Back to All Articles <ArrowRight size={16} />
                    </Link>
                  </Button>
                </motion.span>
                <SparkleOverlay active />
              </span>
            )}
          </div>

          {/* Extra share (X / LinkedIn) */}
          <div className="mt-6 flex gap-3 justify-center">
            <span className="relative inline-block">
              <Button variant="ghost" className="rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]" onClick={() => shareTo('x')}>
                <LinkIcon size={16} className="mr-1" /> Share on X
              </Button>
              <SparkleOverlay active />
            </span>
            <span className="relative inline-block">
              <Button variant="ghost" className="rounded-full transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]" onClick={() => shareTo('linkedin')}>
                <LinkIcon size={16} className="mr-1" /> Share on LinkedIn
              </Button>
              <SparkleOverlay active />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
