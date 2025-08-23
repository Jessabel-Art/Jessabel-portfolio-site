import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PortfolioPage from '@/pages/PortfolioPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ClientsPage from '@/pages/ClientsPage';
import UxProcessPage from '@/pages/UxProcessPage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CaseStudyPage from '@/pages/CaseStudyPage';
import FullSailCaseStudyPage from '@/pages/FullSailCaseStudyPage';
import { projects } from '@/data/projects';
import { posts } from '@/data/blog';

function PageLayout({ children }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
        <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />

        {/* Canonical route */}
        <Route path="/process" element={<PageLayout><UxProcessPage /></PageLayout>} />
        {/* Alias + redirect to keep one URL in analytics/SEO */}
        <Route path="/ux-process" element={<Navigate to="/process" replace />} />

        {/* Portfolio + case studies */}
        <Route path="/portfolio" element={<PageLayout><PortfolioPage projects={projects} /></PageLayout>} />
        <Route path="/portfolio/:projectId" element={<PageLayout><CaseStudyPage projects={projects} /></PageLayout>} />

        {/* Dedicated case study */}
        <Route path="/case-study/full-sail" element={<PageLayout><FullSailCaseStudyPage /></PageLayout>} />

        {/* Blog */}
        <Route path="/blog" element={<PageLayout><BlogPage posts={posts} /></PageLayout>} />
        <Route path="/blog/:postId" element={<PageLayout><BlogPostPage posts={posts} /></PageLayout>} />

        {/* Contact + legal + clients */}
        <Route path="/contact" element={<PageLayout><ContactPage /></PageLayout>} />
        <Route path="/privacy" element={<PageLayout><PrivacyPage /></PageLayout>} />
        <Route path="/terms" element={<PageLayout><TermsPage /></PageLayout>} />
        <Route path="/clients" element={<PageLayout><ClientsPage /></PageLayout>} />

        {/* Optional: catch-all */}
        {/* <Route path="*" element={<PageLayout><HomePage /></PageLayout>} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <Navigation />
        <main className="pt-20">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}
