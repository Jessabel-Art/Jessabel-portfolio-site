import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, User, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // NOTE: Portfolio link removed while the page is hidden
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/blog', label: 'Blog', icon: BookOpen },
  ];

  // Orange brand tokens
  const ORANGE_BAR = '#d74708';
  const ORANGE_BAR_TRANS = 'rgba(215,71,8,0.92)';
  const ACTIVE_PILL = '#ffe574'; // light orange chip

  const isRouteActive = (itemPath) => {
    if (itemPath === '/') return location.pathname === '/';
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
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
        background: scrolled ? ORANGE_BAR_TRANS : ORANGE_BAR,
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,.08)',
        boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,.15)' : '0 3px 10px rgba(0,0,0,.10)',
        transition: 'background .25s ease, box-shadow .25s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand (typographic wordmark) */}
          <Link to="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md" aria-label="Jessabel.Art — Home">
            <motion.span
              key="wordmark"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-bold tracking-tight select-none"
              style={{
                color: '#FFE574',
                textShadow: '0 2px 0 rgba(0,0,0,.18), 0 8px 22px rgba(0,0,0,.25)',
                letterSpacing: '-0.02em',
              }}
            >
              Jessabel.Art
            </motion.span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-4 py-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    active ? 'text-black' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="active-nav-item"
                      className="absolute inset-0 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{ background: ACTIVE_PILL }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA group */}
          <div className="hidden md:flex items-center">
            <Button
              asChild
              variant="outline"
              className="mr-3 rounded-full border-white/25 text-white hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Link to="/clients">Clients</Link>
            </Button>

            <Button asChild className="btn-primary rounded-full focus-visible:ring-2 focus-visible:ring-white/60">
              <Link to="/contact">
                Contact Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
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
        >
          <div className="py-4 space-y-2 px-2">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    active ? 'bg-[#ffe574] text-black' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {/* <item.icon size={18} /> */} {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Mobile CTAs */}
            <div className="pt-3 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full border-white/25 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Link to="/clients" onClick={() => setIsOpen(false)}>
                  Clients
                </Link>
              </Button>

              <Button asChild className="w-full btn-primary rounded-full focus-visible:ring-2 focus-visible:ring-white/60">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4" />
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

