import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, PenLine, Code, TestTube2, Repeat, CheckCircle } from 'lucide-react';

// Local GIF (bundled)
import sereneGif from '@/assets/videos/serene-ux-process.gif';

const UxProcessPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.2 },
  };

  const processSteps = [
    {
      icon: Search,
      title: '1. Discover & Research',
      description:
        'We start by understanding your business goals, target audience, and the problem we’re solving. This involves stakeholder interviews, user research, and competitive analysis to build a solid foundation.',
    },
    {
      icon: PenLine,
      title: '2. Define & Design',
      description:
        'With insights in hand, we map user flows, create wireframes, and develop high-fidelity visual designs. This is where strategy takes shape into an intuitive and engaging interface.',
    },
    {
      icon: Code,
      title: '3. Prototype & Build',
      description:
        'I create interactive prototypes that feel like the real product, allowing for early feedback. For web projects, this phase can extend into full development using modern technologies.',
    },
    {
      icon: TestTube2,
      title: '4. Test & Validate',
      description:
        'Usability testing is crucial. We put the designs in front of real users to observe their interactions, identify pain points, and validate our assumptions before launch.',
    },
    {
      icon: Repeat,
      title: '5. Iterate & Launch',
      description:
        'Based on feedback, we refine the design and prepare for launch. The process doesn’t end here; I believe in continuous improvement based on post-launch data and user feedback.',
    },
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

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeIn}
          className="text-center max-w-4xl mx-auto px-4 py-8 sm:py-10 rounded-3xl bg-[#FFEFD2]"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  'linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))',
              }}
            >
              My UX Process
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-[hsl(var(--muted-foreground))]">
            A structured yet flexible approach to turning complex problems into elegant solutions.
          </p>
        </motion.div>
      </section>

      {/* HIGHLIGHTS + CHECKLIST */}
      <section className="mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: GIF + heading */}
            <motion.div {...fadeIn}>
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">UX Highlights</h2>
                <div className="h-1 w-32 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
              </div>

              {/* 16:9 container with glass frame (ensures legibility) */}
              <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden glass shadow-lg">
                <img
                  src={sereneGif}
                  alt="Serene UX process animation"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {/* subtle white veil for extra contrast on busy frames */}
                <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
              </div>
            </motion.div>

            {/* Right: checklist in soft card */}
            <motion.div
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-md p-6 sm:p-8"
            >
              <h3 className="text-2xl font-bold text-foreground">Project Cornerstones</h3>
              <ul className="space-y-3">
                {checklistItems.map((item, index) => (
                  <li key={index} className="flex items-center text-base sm:text-lg text-[hsl(var(--muted-foreground))]">
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--primary))] mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="mt-16 md:mt-24 bg-[#FFE7B3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">From discovery to launch</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Clear checkpoints keep teams aligned and decisions measurable.
            </p>
          </div>

          <div className="space-y-8 md:space-y-10">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  {...fadeIn}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-6 sm:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 md:min-w-[320px]">
                      {/* Number badge w/ gradient ring */}
                      <div className="relative w-14 h-14 rounded-full p-[2px] shadow">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'conic-gradient(from 0deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))',
                            opacity: 0.9,
                          }}
                          aria-hidden="true"
                        />
                        <span className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center font-extrabold text-[hsl(var(--foreground))]">
                          {i + 1}
                        </span>
                      </div>

                      {/* Icon chip + title */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))/0.12] flex items-center justify-center">
                          <Icon size={26} className="text-[hsl(var(--accent))]" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WRAP / visual rhythm */}
      <section className="bg-[#FFD894]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Want a deeper dive into artifacts and deliverables? Check the case studies on the Portfolio page.
          </p>
          <div className="h-1.5 w-40 mx-auto mt-4 rounded bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]" />
        </div>
      </section>
    </div>
  );
};

export default UxProcessPage;
