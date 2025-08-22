import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, User, ArrowLeft, ArrowRight, Clock, Share2, Copy, ListTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Post = {
  id?: string | number;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string; // sanitized HTML upstream
  date?: string; // ISO preferred
  author?: string;
  tags?: string[];
  category?: string;
  cover?: string;
  heroImage?: string;
  coverAlt?: string;
  heroAlt?: string;
};

const BlogPostPage = ({ posts = [] as Post[] }) => {
  // Support either /blog/:id or /blog/:postId
  const { id, postId } = useParams();
  const targetId = id ?? postId;

  // ---------- Helpers ----------
  const parseDate = (d?: string) => (d ? new Date(d) : null);
  const keyFor = (p?: Post | null) => (p?.slug ?? p?.id) as string | number | undefined;
  const grad = 'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] text-white font-semibold shadow-lg';
  const outline = 'border border-[hsl(var(--border))]';

  // Normalize & order posts (newest first if dates exist)
  const ordered = useMemo(() => {
    const arr = posts.filter(Boolean);
    const hasDates = arr.some(p => p.date);
    if (!hasDates) return arr;
    return [...arr].sort((a, b) => {
      const da = parseDate(a.date)?.getTime() ?? 0;
      const db = parseDate(b.date)?.getTime() ?? 0;
      return db - da; // newest -> oldest
    });
  }, [posts]);

  // Find the current post robustly (slug OR id)
  const postIndex = useMemo(() => {
    const idx = ordered.findIndex(
      (p) => String(p.id) === String(targetId) || String(p.slug) === String(targetId)
    );
    return idx;
  }, [ordered, targetId]);

  const post = postIndex >= 0 ? ordered[postIndex] : null;
  const prevPost = postIndex > 0 ? ordered[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < ordered.length - 1 ? ordered[postIndex + 1] : null;

  // UI state
  const articleRef = useRef<HTMLElement | null>(null);
  const [toc, setToc] = useState<{id: string; text: string; level: 2 | 3}[]>([]);
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
      try { await navigator.share(data); } catch {/* canceled */}
    } else {
      handleCopyLink();
    }
  };

  const shareTo = (network: 'x' | 'linkedin') => {
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
      <div className="py-20 text-center">
        <Helmet>
          <title>Post Not Found - Jessabel.Art</title>
        </Helmet>
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">404 - Post Not Found</h1>
        <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">The article you are looking for does not exist.</p>
        <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-[hsl(var(--primary))] hover:underline">
          <ArrowLeft size={16} /> Back to All Articles
        </Link>
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

    const slugify = (s: string) =>
      s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    const headings = Array.from(el.querySelectorAll('h2, h3')) as HTMLElement[];
    const tocItems: {id: string; text: string; level: 2 | 3}[] = [];
    const used = new Set<string>();
    headings.forEach((h) => {
      const level = (h.tagName.toLowerCase() === 'h3' ? 3 : 2) as 2 | 3;
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
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
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
    <div className="py-20">
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

      {/* Sticky reading progress */}
      <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[3px] z-40 bg-transparent" style={{ pointerEvents: 'none' }}>
        <div className="h-full transition-[width] duration-150 ease-out"
             style={{ width: `${progress}%`, background: 'linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))' }} />
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
                    <a
                      href={`#${item.id}`}
                      className={`block rounded px-2 py-1 transition-colors ${
                        activeId === item.id
                          ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--foreground))/0.06]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        {/* Main column */}
        <div>
          {/* Back to All Articles (button style) */}
          <div className="mb-8">
            <Button asChild variant="outline" className={`${outline}`}>
              <Link to="/blog" className="inline-flex items-center gap-2">
                <ArrowLeft size={16} /> All Articles
              </Link>
            </Button>
          </div>

          {/* Hero / Meta */}
          <div className="mb-12">
            {coverUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-[hsl(var(--muted))/0.2]">
                <img
                  src={coverUrl}
                  alt={post.coverAlt || post.heroAlt || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-[linear-gradient(135deg,#fa8a00,#fec200)]" />
            )}

            {post.category && (
              <p className="text-sm font-semibold bg-[hsl(var(--secondary))] text-white inline-block px-2.5 py-1 rounded-full mb-3 capitalize">
                {post.category}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-4">{post.title}</h1>

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
                <Button size="sm" variant="outline" className="h-8 px-3" onClick={handleWebShare} title="Share">
                  <Share2 size={14} className="mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-3" onClick={handleCopyLink} title="Copy link">
                  <Copy size={14} className="mr-2" />
                  Copy
                </Button>
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
          </div>

          {/* Mobile ToC */}
          {toc.length > 0 && (
            <div className="lg:hidden mb-6">
              <button
                type="button"
                onClick={() => setTocOpen((v) => !v)}
                className="w-full flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3"
                aria-expanded={tocOpen}
                aria-controls="mobile-toc"
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <ListTree size={16} /> On this page
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">{tocOpen ? 'Hide' : 'Show'}</span>
              </button>
              {tocOpen && (
                <nav id="mobile-toc" className="mt-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setTocOpen(false)}
                          className={`block rounded px-2 py-1 ${
                            activeId === item.id
                              ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--foreground))/0.06]'
                              : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          )}

          {/* Content */}
          {sanitizedHtml ? (
            <article
              ref={articleRef as any}
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
                dark:prose-invert
              "
              // Ensure post.content is sanitized HTML upstream
              dangerouslySetInnerHTML={{ __html: post.content as string }}
            />
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
              <Button asChild variant="outline" className={`${outline}`}>
                <Link to={`/blog/${keyFor(prevPost)}`} className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Previous:</span> {prevPost.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}

            {nextPost ? (
              <Button asChild className={grad}>
                <Link to={`/blog/${keyFor(nextPost)}`} className="flex items-center gap-2">
                  <span className="hidden sm:inline">Next:</span> {nextPost.title}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className={`${outline}`}>
                <Link to="/blog" className="flex items-center gap-2">
                  Back to All Articles <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </div>

          {/* Extra share (X / LinkedIn) */}
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => shareTo('x')}>Share on X</Button>
            <Button variant="ghost" onClick={() => shareTo('linkedin')}>Share on LinkedIn</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;

