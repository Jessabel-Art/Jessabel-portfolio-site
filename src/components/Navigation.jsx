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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pills: Home, About, Clients (Blog removed)
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/clients', label: 'Clients' },
  ];

  const WARM_BROWN = 'var(--warm-brown-hex)';

  const isRouteActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Primary"
      style={{
        background: 'transparent',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,.10)' : 'none',
        transition: 'all .25s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Wordmark */}
          <Link
            to="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,0,0,.18)] rounded-md"
            aria-label="Jessabel.Art — Home"
          >
            <motion.span
              key="wordmark"
              initial={{ y: -12, opacity: 0, rotateX: 10 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="text-3xl md:text-4xl font-extrabold tracking-[-0.01em] select-none"
              style={{
                color: WARM_BROWN,
                textShadow: '0 1px 0 rgba(255,255,255,.25)',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Jessabel<span>.Art</span>
            </motion.span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseMove={setMouseVars}
                  className={`group relative inline-flex items-center gap-1.5 rounded-full px-4 h-10 font-semibold transition-all`}
                  style={{
                    color: active ? '#0B0F1A' : WARM_BROWN,
                    background: active ? 'rgba(255,255,255,.85)' : 'transparent',
                    border: '1px solid rgba(0,0,0,.10)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  {/* subtle hover glow */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(18px 18px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.5), transparent 60%)',
                      mixBlendMode: 'screen',
                    }}
                  />
                </Link>
              );
            })}

            {/* Contact button (unchanged) */}
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
              className="hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[rgba(0,0,0,.18)]"
              style={{ color: WARM_BROWN }}
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
          style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, border: '1px solid rgba(0,0,0,.08)' }}
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
                  className={`group relative flex items-center justify-between px-4 h-11 rounded-full font-semibold transition-all`}
                  style={{
                    color: active ? '#0B0F1A' : WARM_BROWN,
                    background: active ? 'rgba(255,255,255,.9)' : 'transparent',
                    border: '1px solid rgba(0,0,0,.10)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </Link>
              );
            })}

            {/* Contact button (unchanged) */}
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
