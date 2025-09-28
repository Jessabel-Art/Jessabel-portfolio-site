import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerChildren, childFade } from '@/lib/motionPresets';
import CaseCard from '@/components/CaseCard';
import QuickPeekModal from '@/components/QuickPeekModal';

const PROJECTS = [
  {
    id: 'fundflo',
    title: 'FundFlo – Fintech UX',
    role: 'UX • UI • Design Systems',
    blurb: 'Budgeting flows, visual brand, responsive UI.',
    cover: '/assets/work/fundflo-cover.jpg', // replace with your asset
    bullets: ['Onboarding simplification', 'Component library', 'A11y color tokens'],
    href: '/work/fundflo'
  },
  {
    id: 'sanchez',
    title: 'Sanchez Services – Booking UX',
    role: 'UX • UI • Frontend',
    blurb: 'Self-serve booking + client portal micro-flows.',
    cover: '/assets/work/sanchez-cover.jpg',
    bullets: ['Service cards that convert', 'Frictionless contact form', 'Trust badges'],
    href: '/work/sanchez-services'
  },
  {
    id: 'marketplace',
    title: 'Marketplace Simulation – Strategy UI',
    role: 'Product • Analytics',
    blurb: 'Data-driven decisions + UI storytelling.',
    cover: '/assets/work/marketplace-cover.jpg',
    bullets: ['KPI dashboard design', 'Cinematic reveals', 'Q1–Q6 narrative'],
    href: '/work/marketplace'
  }
];

export default function Work() {
  const [peek, setPeek] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Selected Work</h1>
        <p className="opacity-80 mt-1">A few highlights. More on request.</p>
      </header>

      <motion.div variants={staggerChildren(0.06)} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map(p => (
          <motion.div key={p.id} variants={childFade}>
            <CaseCard project={p} onQuickPeek={() => setPeek(p)} />
          </motion.div>
        ))}
      </motion.div>

      <QuickPeekModal project={peek} onClose={() => setPeek(null)} />
    </div>
  );
}