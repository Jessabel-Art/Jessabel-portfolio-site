import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, User, ArrowLeft, ArrowRight, Clock, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BlogPostPage = ({ posts = [] }) => {
  // Support either /blog/:id or /blog/:postId
  const { id, postId } = useParams();
  const targetId = id ?? postId;

  const postIndex = posts.findIndex(
    (p) => String(p.id) === String(targetId) || String(p.slug) === String(targetId)
  );
  const post = postIndex >= 0 ? posts[postIndex] : null;

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  // helpers
  const keyFor = (p) => p?.slug || p?.id;
  const coverUrl = post?.cover || post?.heroImage || null;

  const readingMinutes = useMemo(() => {
    if (!post) return 1;
    const html = String(post.content || '');
    const text = html.replace(/<[^>]+>/g, ' ') + ' ' + (post.excerpt || '');
    const words = text.trim().split(/\s+/).filter(Boolean).length || 120;
    return Math.max(1, Math.round(words / 200));
  }, [post]);

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
        /* user canceled */
      }
    } else {
      handleCopyLink();
    }
  };

  const shareTo = (network) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || 'Article');
    const desc = encodeURIComponent(post?.excerpt || '');
    let href = '';
    if (network === 'x') {
      href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
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

  // tag pill styles (match Blog page logic)
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

  // ---------- New: Reading progress + auto TOC ----------
  const articleRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]); // [{id,text,level}]

  // Build TOC and ensure headings have IDs
  useEffect(() => {
    if (!articleRef.current) return;
    const root = articleRef.current;
    const headings = Array.from(root.querySelectorAll('h2, h3'));
    const slugify = (s) =>
      s
        .toLowerCase()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-+|\-+$/g, '');
    const items = headings.map((el) => {
      if (!el.id) el.id = slugify(el.textContent || 'section');
      return { id: el.id, text: el.textContent || '', level: el.tagName.toLowerCase() === 'h3' ? 3 : 2 };
    });
    setToc(items);
  }, [post?.content]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - (el.offsetTop - 24), 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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

      {/* Progress bar */}
      <div className="sticky top-[64px] z-30 h-1 bg-[hsl(var(--border))] rounded-full overflow-hidden mx-auto max-w-4xl">
        <div
          className="h-full bg-[hsl(var(--secondary))] transition-[width] duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(240px,320px)] gap-10"
        >
          {/* Main column */}
          <div>
            {/* Back */}
            <div className="mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <ArrowLeft size={16} /> All Articles
              </Link>
            </div>

            {/* Hero / Meta */}
            <div className="mb-12">
              {coverUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 bg-[hsl(var(--muted))/0.2]">
                  <img
                    src={coverUrl}
                    alt={post.coverAlt || post.heroAlt || ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
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

            {/* Content */}
            <article
              ref={articleRef}
              className="
                prose prose-lg max-w-none
                prose-headings:font-bold
                prose-headings:text-[hsl(var(--foreground))]
                prose-p:text-[hsl(var(--muted-foreground))]
                prose-a:text-[hsl(var(--primary))] hover:prose-a:no-underline
                prose-strong:text-[hsl(var(--foreground))]
                prose-ul:list-disc prose-ul:pl-6
                prose-li:text-[hsl(var(--muted-foreground))]
                prose-li:marker:text-[hsl(var(--primary))]
                prose-img:rounded-xl prose-img:border prose-img:border-[hsl(var(--border))]
                dark:prose-invert
              "
              // Ensure post.content is sanitized HTML
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Prev / Next */}
            <div className="mt-16 pt-8 border-t border-[hsl(var(--border))] flex justify-between items-center">
              {prevPost ? (
                <Button asChild variant="outline">
                  <Link to={`/blog/${keyFor(prevPost)}`} className="flex items-center gap-2">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Previous:</span> {prevPost.title}
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Button asChild variant="outline">
                  <Link to={`/blog/${keyFor(nextPost)}`} className="flex items-center gap-2">
                    <span className="hidden sm:inline">Next:</span> {nextPost.title}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* Extra share (X / LinkedIn) */}
            <div className="mt-6 flex gap-3 justify-center">
              <Button variant="ghost" onClick={() => shareTo('x')}>Share on X</Button>
              <Button variant="ghost" onClick={() => shareTo('linkedin')}>Share on LinkedIn</Button>
            </div>
          </div>

          {/* TOC (desktop) */}
          <aside className="hidden lg:block sticky top-[104px] h-max">
            {toc.length > 0 && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-5">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">On this page</p>
                <ul className="space-y-2">
                  {toc.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                      <a
                        href={`#${h.id}`}
                        className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:underline"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;

