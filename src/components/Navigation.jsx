import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
  ];

  // ——— Navy header palette
  const NAVY = '#0B0F1A';
  const NAVY_TRANS = 'rgba(11,15,26,.92)';
  const ACTIVE_PILL = '#ffe574';

  const isRouteActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  const isClientsActive =
    location.pathname === '/clients' || location.pathname.startsWith('/clients/');

  // small helper to drive the sparkle hotspot with CSS variables
  const setMouseVars = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Primary"
      style={{
        // layered gradient for dimension (not flat), plus blur
        background: scrolled
          ? `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)) , ${NAVY_TRANS}`
          : `linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04)) , ${NAVY}`,
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        boxShadow: scrolled
          ? '0 16px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)'
          : '0 12px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08)',
        transition: 'background .25s ease, box-shadow .25s ease',
      }}
    >
      {/* glossy top highlight strip for extra depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(255,255,255,.10),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md"
            aria-label="Jessabel.Art — Home"
          >
            <motion.span
              key="wordmark"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl md:text-4xl font-bold tracking-tight select-none"
              style={{
                color: '#fff',
                textShadow: '0 2px 0 rgba(0,0,0,.25), 0 10px 24px rgba(0,0,0,.35)',
                letterSpacing: '-0.02em',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Jessabel<span>.Art</span>
            </motion.span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  onMouseMove={setMouseVars}
                  className={`group relative overflow-hidden px-5 py-2.5 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    active ? 'text-black' : 'text-white/90 hover:text-white'
                  }`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {/* Active gold pill */}
                  {active && (
                    <motion.div
                      layoutId="active-nav-item"
                      className="absolute inset-0 rounded-full shadow-[0_8px_18px_rgba(0,0,0,.28)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{ background: ACTIVE_PILL }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Sparkle hotspot + subtle hover tint */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(22px 22px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.55), transparent 60%), linear-gradient(180deg, transparent, rgba(255,255,255,.06))',
                      mixBlendMode: 'screen',
                    }}
                    aria-hidden="true"
                  />
                  {/* gradient text on hover (when not active) */}
                  {!active && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          'linear-gradient(90deg, var(--btn-pink,#ff3ea5), var(--btn-teal,#00c2b2))',
                        filter: 'blur(10px)',
                        opacity: 0.25,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                    {/* subtle sparkle icon that fades in */}
                    <Sparkles
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center">
            {/* Clients — now uses Button to exactly match Contact shape */}
            <Button
              asChild
              variant="outline"
              className={`rounded-full h-11 px-6 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white/60 relative overflow-hidden ${
                isClientsActive
                  ? 'text-white'
                  : 'text-white border-white/25 bg-white/10 hover:bg-white/16'
              }`}
              style={{
                background: isClientsActive
                  ? 'linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))'
                  : undefined,
              }}
            >
              <Link to="/clients" onMouseMove={setMouseVars} className="group relative">
                {/* sparkle hotspot */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(28px 28px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 60%)',
                    mixBlendMode: 'screen',
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center gap-2">
                  Clients
                  <Sparkles
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Button>

            {/* Contact — primary pill (unchanged shape) with sparkle hover */}
            <Button
              asChild
              className="btn-primary rounded-full h-11 px-6 focus-visible:ring-2 focus-visible:ring-white/60 relative overflow-hidden ml-2"
            >
              <Link to="/contact" onMouseMove={setMouseVars} className="group relative">
                <span
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(28px 28px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 60%)',
                    mixBlendMode: 'screen',
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center">
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-pressed={isOpen}
              className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile drawer */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="py-4 space-y-2 px-2">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  onMouseMove={setMouseVars}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative overflow-hidden flex items-center justify-between px-4 py-3 rounded-full transition-all duration-300 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    active ? 'bg-[#ffe574] text-black' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {/* sparkle */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(22px 22px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.55), transparent 60%)',
                      mixBlendMode: 'screen',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    {item.label}
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </Link>
              );
            })}

            {/* Mobile CTAs */}
            <div className="pt-3 flex flex-col gap-2">
              {/* Clients — same shape as Contact */}
              <Button
                asChild
                variant="outline"
                className={`w-full rounded-full h-11 px-6 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white/60 relative overflow-hidden ${
                  isClientsActive
                    ? 'text-white'
                    : 'text-white border-white/25 bg-white/10 hover:bg-white/16'
                }`}
                style={{
                  background: isClientsActive
                    ? 'linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))'
                    : undefined,
                }}
              >
                <Link to="/clients" onClick={() => setIsOpen(false)} onMouseMove={setMouseVars} className="group">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(28px 28px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 60%)',
                      mixBlendMode: 'screen',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Clients
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </Link>
              </Button>

              {/* Contact — primary pill */}
              <Button
                asChild
                className="w-full btn-primary rounded-full h-11 px-6 focus-visible:ring-2 focus-visible:ring-white/60 relative overflow-hidden"
              >
                <Link to="/contact" onClick={() => setIsOpen(false)} onMouseMove={setMouseVars} className="group">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(28px 28px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 60%)',
                      mixBlendMode: 'screen',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center">
                    Contact Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
