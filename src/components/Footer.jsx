import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const handleSocialClick = (url, label) => {
    toast({ title: `Opening ${label}…`, description: 'This will open in a new tab.' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/jessysantos31' },
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/jessieleonne/' },
  ];

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Clients', path: '/clients' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      role="contentinfo"
      className="relative overflow-hidden border-t"
      style={{ backgroundColor: '#d74708', borderColor: 'rgba(255,255,255,0.18)' }}
    >
      {/* subtle top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-8"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-10 md:py-12 text-center md:text-left">
          {/* Brand (logotype, bold, no italics) */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              aria-label="Jessabel.Art — Home"
              className="inline-flex items-baseline leading-none"
            >
              <span
                className="text-white text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Jessabel<span>.Art</span>
              </span>
            </Link>
            <p className="mt-3 text-base text-white/90 max-w-xs font-medium">
              Designing usable, beautiful interfaces and purposeful brands.
            </p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer navigation" className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg text-white mb-3 underline underline-offset-4 decoration-white/70">
              Navigate
            </h3>
            <ul className="space-y-1.5">
              {navLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-white/85 hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg text-white mb-3">Connect</h3>
            <div className="flex space-x-3" role="group" aria-label="Social links">
              {socialLinks.map(({ icon: Icon, label, url }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSocialClick(url, label)}
                  className="w-10 h-10 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={18} className="text-white" aria-hidden="true" />
                </motion.button>
              ))}
            </div>

            <a
              href="mailto:hello@jessabel.art"
              className="mt-3 text-sm text-white/85 hover:text-white transition-colors"
            >
              hello@jessabel.art
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col-reverse md:flex-row items-center justify-between gap-3 pb-8">
          <p className="text-sm text-white/80 text-center md:text-left">
            © {new Date().getFullYear()} Jessabel.Art. All rights reserved.
            <span className="block md:inline opacity-80"> Fueled by caffeine and curiosity.</span>
          </p>

          <div className="flex items-center gap-3">
            {legalLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="text-sm text-white/85 hover:text-white hover:underline underline-offset-4 transition-colors"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={backToTop}
              className="inline-flex items-center gap-2 text-sm rounded-full px-3 py-1.5 font-semibold shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ff3ea5, #00c2b2)',
                color: '#ffffff',
              }}
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp size={16} />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
