import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, PenLine, Code, TestTube2, Repeat, CheckCircle } from 'lucide-react';

// 🔁 Local GIF (bundled/hashes correctly)
import sereneGif from '@/assets/videos/serene-ux-process.gif';

const UxProcessPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.2 },
  };

  const processSteps = [
    { icon: Search,   title: '1. Discover & Research', description: 'We start by understanding your business goals, target audience, and the problem we’re solving. This involves stakeholder interviews, user research, and competitive analysis to build a solid foundation.' },
    { icon: PenLine,  title: '2. Define & Design',      description: 'With insights in hand, we map user flows, create wireframes, and develop high-fidelity visual designs. This is where strategy takes shape into an intuitive and engaging interface.' },
    { icon: Code,     title: '3. Prototype & Build',     description: 'I create interactive prototypes that feel like the real product, allowing for early feedback. For web projects, this phase can extend into full development using modern technologies.' },
    { icon: TestTube2,title: '4. Test & Validate',       description: 'Usability testing is crucial. We put the designs in front of real users to observe their interactions, identify pain points, and validate our assumptions before launch.' },
    { icon: Repeat,   title: '5. Iterate & Launch',      description: 'Based on feedback, we refine the design and prepare for launch. The process doesn’t end here; I believe in continuous improvement based on post-launch data and user feedback.' },
  ];

  const checklistItems = [
    'Clear project goals defined',
    'User personas and journeys mapped',
    'Accessible and inclusive design practices',
    'Data-driven design decisions',
    'Scalable and maintainable implementation',
  ];

  return (
    <div className="py-20">
      <Helmet>
        <title>My UX Process - Jessabel.Art</title>
        <meta
          name="description"
          content="Discover the step-by-step process I use to design and develop user-centric digital experiences."
        />
      </Helmet>

      <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground">
          My <span className="gradient-text">UX Process</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          A structured yet flexible approach to turning complex problems into elegant solutions.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: GIF + heading */}
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-foreground mb-4">UX Highlights</h2>

            {/* 16:9 container */}
            <div className="relative w-full rounded-2xl overflow-hidden glass shadow-lg pt-[56.25%]">
              {/* GIF replaces <video> */}
              <img
                src={sereneGif}
                alt="Serene UX process animation"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Right: checklist */}
          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Project Cornerstones</h3>
            <ul className="space-y-3">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-center text-lg text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))] mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="mt-24 md:mt-32 space-y-12">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} {...fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="flex items-center gap-4 md:col-span-1">
                  <div className="w-16 h-16 bg-[hsl(var(--secondary))/0.12] rounded-xl flex items-center justify-center">
                    <Icon size={32} className="text-[hsl(var(--secondary))]" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                </div>
                <div className="md:col-span-2">
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UxProcessPage;


