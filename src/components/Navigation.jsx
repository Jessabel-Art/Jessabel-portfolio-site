import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BG_COLOR = '#FEE6D4';              // site background
const WARM_BROWN = 'var(--warm-brown-hex)';

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

  // Only these three (blog hidden)
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/clients', label: 'Clients' },
  ];

  const isRouteActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* spacer so content doesn't slide under the fixed nav */}
      <div aria-hidden className="h-20" style={{ background: '#FEE6D4' }} />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Primary"
        style={{ background: 'transparent' }} // background rendered by the strip below
      >
        {/* Background strip that fades out on scroll (so only buttons remain) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: BG_COLOR,
            transition: 'opacity .25s ease',
            opacity: scrolled ? 0 : 1,
            borderBottom: '1px solid rgba(0,0,0,.06)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand in a soft pill (still visible when scrolling) */}
            <Link
              to="/"
              className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,0,0,.18)] rounded-full"
              aria-label="Jessabel.Art — Home"
            >
              <motion.div
                initial={{ y: -12, opacity: 0, rotateX: 10 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                className="px-4 py-2.5 rounded-full border border-[rgba(0,0,0,.08)] bg-white/85 backdrop-blur"
              >
                <span
                  className="text-2xl md:text-3xl font-extrabold tracking-[-0.01em] select-none"
                  style={{
                    color: WARM_BROWN,
                    textShadow: '0 1px 0 rgba(255,255,255,.25)',
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  Jessabel<span>.Art</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop: segmented pills + contact */}
            <div className="hidden md:flex items-center gap-3">
              {/* Segmented pill group */}
              <div
                className="inline-flex items-stretch rounded-full border border-[rgba(0,0,0,.10)] overflow-hidden"
                role="tablist"
                aria-label="Site sections"
                style={{
                  background: 'rgba(255,255,255,.85)',
                  backdropFilter: scrolled ? 'blur(10px)' : 'blur(4px)',
                  boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,.12)' : 'none',
                  transition: 'backdrop-filter .25s ease, box-shadow .25s ease',
                }}
              >
                {navItems.map((item, i) => {
                  const active = isRouteActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      role="tab"
                      aria-selected={active}
                      className={[
                        'px-5 h-11 inline-flex items-center font-semibold transition-colors',
                        i !== 0 ? 'border-l border-[rgba(0,0,0,.08)]' : '',
                        active
                          ? 'bg-white text-[#0B0F1A]'
                          : 'text-[color:var(--warm-brown-hex)] hover:bg-white/70',
                      ].join(' ')}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Contact button — unchanged */}
              <Button asChild className="btn-primary rounded-full h-11 px-6 relative overflow-hidden">
                <Link to="/contact">
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
                className="hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[rgba(0,0,0,.18)] rounded-full"
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
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,.08)',
            }}
          >
            <div className="py-3 px-2">
              <div className="flex flex-col">
                {navItems.map((item, i) => {
                  const active = isRouteActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={[
                        'w-full h-11 px-4 rounded-full font-semibold flex items-center justify-between transition-colors',
                        i !== 0 ? 'mt-2' : '',
                        active
                          ? 'bg-white text-[#0B0F1A]'
                          : 'bg-white/70 text-[color:var(--warm-brown-hex)] hover:bg-white',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Button
                  asChild
                  className="w-full btn-primary rounded-full h-11 px-6 mt-3 relative overflow-hidden"
                >
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
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
    </>
  );
};

export default Navigation;
