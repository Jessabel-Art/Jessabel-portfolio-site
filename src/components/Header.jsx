// src/components/Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_BG = 'rgba(10, 13, 26, 0.55)';      // glassy navy
const NAV_BG_SCROLLED = 'rgba(10, 13, 26, 0.75)';
const BORDER = 'rgba(255,255,255,0.08)';
const INK = 'rgba(255,255,255,0.92)';
const INK_DIM = 'rgba(255,255,255,0.72)';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Hide header entirely on the welcome entry page
  if (location.pathname === '/welcome') return null;

  // One-pager section anchors (hash links)
  const sectionLinks = [
    { href: '#hero', label: 'Hero' },
    { href: '#what-i-do', label: 'What I Do' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route/hash change
  useEffect(() => setIsOpen(false), [location.pathname, location.hash]);

  const toggle = useCallback(() => setIsOpen(v => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Primary"
    >
      {/* Glass background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: scrolled ? NAV_BG_SCROLLED : NAV_BG,
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          borderBottom: `1px solid ${BORDER}`,
          transition: 'all .25s ease',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            to="/"
            className="group inline-flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Jessabel.Art — Home"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="px-4 py-2.5 rounded-full border"
              style={{
                borderColor: BORDER,
                background: 'rgba(255,255,255,0.06)',
                color: INK,
                textShadow: '0 1px 0 rgba(0,0,0,.25)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                letterSpacing: '-0.01em',
                fontSize: 'clamp(20px, 2.2vw, 28px)',
              }}
            >
              Jessabel<span style={{ opacity: .9 }}>.Art</span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {/* Section pills */}
            <div
              className="inline-flex items-stretch rounded-full overflow-hidden"
              role="tablist"
              aria-label="Page sections"
              style={{
                border: `1px solid ${BORDER}`,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {sectionLinks.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  role="tab"
                  className={[
                    'px-5 h-11 inline-flex items-center font-semibold transition-colors',
                    i !== 0 ? 'border-l' : '',
                  ].join(' ')}
                  style={{
                    borderColor: BORDER,
                    color: INK_DIM,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Contact CTA (route or hash — use what you have) */}
            <Button asChild className="rounded-full h-11 px-6">
              <a href="#contact" className="flex items-center">
                Contact <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggle}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              style={{ color: INK }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden rounded-2xl border"
              style={{
                borderColor: BORDER,
                background: 'rgba(10,13,26,0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="py-3 px-2">
                <div className="flex flex-col">
                  {sectionLinks.map((item, i) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={[
                        'w-full h-11 px-4 rounded-full font-semibold flex items-center justify-between transition-colors',
                        i !== 0 ? 'mt-2' : '',
                      ].join(' ')}
                      style={{
                        color: INK,
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {item.label}
                    </a>
                  ))}

                  <Button asChild className="w-full rounded-full h-11 px-6 mt-3">
                    <a href="#contact" onClick={close} className="flex items-center">
                      Contact <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
