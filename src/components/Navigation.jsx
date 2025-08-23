import React, { useState, useEffect } from 'react';
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

  const NAVY = '#0B0F1A';
  const NAVY_TRANS = 'rgba(11,15,26,.92)';

  const isRouteActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  const isClientsActive =
    location.pathname === '/clients' || location.pathname.startsWith('/clients/');

  // sparkle hotspot helper
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
        background: scrolled ? NAVY_TRANS : NAVY,
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        boxShadow: scrolled
          ? '0 16px 40px rgba(0,0,0,.35)'
          : '0 12px 28px rgba(0,0,0,.28)',
        transition: 'background .25s ease, box-shadow .25s ease',
      }}
    >
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

          {/* Desktop links + CTAs all together */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseMove={setMouseVars}
                  className={`group relative font-semibold transition-all duration-300 ${
                    active ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(18px 18px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.5), transparent 60%)',
                      mixBlendMode: 'screen',
                    }}
                  />
                </Link>
              );
            })}

            {/* Clients button */}
            <Button
              asChild
              variant="outline"
              className={`rounded-full h-11 px-6 font-semibold transition-all relative overflow-hidden ${
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
                <span className="relative z-10 flex items-center gap-2">
                  Clients
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </span>
              </Link>
            </Button>

            {/* Contact button */}
            <Button
              asChild
              className="btn-primary rounded-full h-11 px-6 relative overflow-hidden"
            >
              <Link to="/contact" onMouseMove={setMouseVars} className="group relative">
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
                  className={`group relative flex items-center justify-between px-4 py-3 font-semibold transition-all duration-300 ${
                    active ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </Link>
              );
            })}

            {/* Clients button */}
            <Button
              asChild
              variant="outline"
              className={`w-full rounded-full h-11 px-6 font-semibold relative overflow-hidden ${
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
              <Link to="/clients" onClick={() => setIsOpen(false)} className="group relative">
                <span className="relative z-10 flex items-center gap-2">
                  Clients
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </span>
              </Link>
            </Button>

            {/* Contact button */}
            <Button
              asChild
              className="w-full btn-primary rounded-full h-11 px-6 relative overflow-hidden"
            >
              <Link to="/contact" onClick={() => setIsOpen(false)} className="group relative">
                <span className="relative z-10 flex items-center">
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;

