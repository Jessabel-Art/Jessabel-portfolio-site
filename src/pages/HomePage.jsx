import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  LayoutGrid,
  Lightbulb,
  Users,
  PenTool,
  BarChart3,
  Briefcase,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Local HERO image
import heroBg from '@/assets/images/hero-bg.jpg';

const HomePage = () => {
  const handleConsultationClick = () => {
    toast({
      title: 'Let’s make something delightful ✨',
      description: 'Taking you to the contact page to start a quick consultation.',
    });
  };

  const expertise = [
    { icon: LayoutGrid, title: 'UX/UI Design', description: 'Intuitive, accessible, visually engaging interfaces.' },
    { icon: Lightbulb,   title: 'Prototyping', description: 'Interactive mockups for rapid iteration and clarity.' },
    { icon: Users,       title: 'User Research', description: 'Testing, surveys, and observation for real insights.' },
    { icon: PenTool,     title: 'Branding', description: 'Cohesive, memorable systems that scale.' },
    { icon: BarChart3,   title: 'UX Strategy', description: 'Business goals aligned to user expectations.' },
    { icon: Briefcase,   title: 'Career & Biz Support', description: 'Roadmaps, positioning, and GTM ops that work.' },
  ];

  const reviews = [
    { name: 'Alicia M., Founder', quote: 'Jess turned our messy idea into a clear, lovable product flow.' },
    { name: 'Derrick P., Product Lead', quote: 'Stakeholders finally understood the vision after her prototype.' },
    { name: 'Lena R., Marketing Director', quote: 'Brand system feels bold yet usable across all channels.' },
    { name: 'Mateo S., Engineering Manager', quote: 'Design handoff was a dream—clean files and thoughtful states.' },
    { name: 'Priya K., Startup CEO', quote: 'Customers stopped getting lost. Time-to-value went way up.' },
    { name: 'Nora T., Ops Lead', quote: 'Workshops were focused, friendly, and actually productive.' },
  ];

  // Accent chips for “What I Bring”
  const ACCENTS = [
    { bg: 'bg-[#22d3ee]/20', chip: 'bg-[#22d3ee]', ring: 'ring-[#22d3ee]' },
    { bg: 'bg-[#a78bfa]/20', chip: 'bg-[#a78bfa]', ring: 'ring-[#a78bfa]' },
    { bg: 'bg-[#f59e0b]/20', chip: 'bg-[#f59e0b]', ring: 'ring-[#f59e0b]' },
    { bg: 'bg-[#fb7185]/20', chip: 'bg-[#fb7185]', ring: 'ring-[#fb7185]' },
    { bg: 'bg-[#34d399]/20', chip: 'bg-[#34d399]', ring: 'ring-[#34d399]' },
    { bg: 'bg-[#60a5fa]/20', chip: 'bg-[#60a5fa]', ring: 'ring-[#60a5fa]' },
  ];

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Jessabel.Art · UX Designer</title>
        <meta
          name="description"
          content="Research‑driven UX, thoughtful UI, and design systems that scale. I turn ideas into seamless, human‑centered digital experiences."
        />
      </Helmet>

      {/* HERO (refreshed look) */}
      <section className="relative min-h-[74vh] sm:min-h-[82vh] md:min-h-[86vh] grid place-items-center overflow-clip">
        <img src={heroBg} alt="" className="hero-image" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.25))]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            {/* New gradient headline */}
            <h1
              className="
                font-['Playfair_Display'] font-extrabold tracking-[-0.01em]
                text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.05]
                bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff),var(--btn-teal,#00c2b2))]
                bg-clip-text text-transparent
                drop-shadow-[0_6px_24px_rgba(0,0,0,.35)]
              "
            >
              I design seamless, human‑centered digital experiences.
            </h1>

            <p
              className="mt-4 sm:mt-6 text-[clamp(1.05rem,2.1vw,1.35rem)] max-w-3xl"
              style={{ color: 'var(--orange-200)', textShadow: '0 2px 12px rgba(0,0,0,.28)' }}
            >
              Research‑driven UX, thoughtful UI, and design systems that scale—so your product feels intuitive,
              inclusive, and measurable from day one.
            </p>

            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Button
                asChild
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact" aria-label="Start a project">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg
                           border-white/35 text-white bg-white/10 backdrop-blur hover:bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Link to="/portfolio" aria-label="See my work">
                  See my work
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT I BRING */}
      <section className="relative z-10 -mt-4 md:-mt-8 py-14 md:py-20 bg-[hsl(var(--background))] rounded-t-[28px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">What I Bring to Every Project</h2>
            <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
              Strategy, taste, and rigorous usability—delivered through a clear, collaborative process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {expertise.map((s, index) => {
              const Icon = s.icon;
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.8)]
                              shadow-sm hover:shadow-md transition-all ring-1 ring-transparent hover:${accent.ring}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${accent.chip}`} />
                  <div className="p-6 sm:p-8">
                    <div className={`w-12 h-12 rounded-xl ${accent.bg} flex items-center justify-center mb-5`}>
                      <Icon className={`${accent.chip.replace('bg-', 'text-')}`} size={24} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm sm:text-base">{s.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — smoother spacing & contrast */}
      <section className="py-14 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-8 sm:mb-10"
          >
            Kind words from collaborators
          </motion.h2>

          <div className="w-full overflow-hidden mask-edge-x">
            <ul className="flex gap-4 sm:gap-6 animate-infinite-scroll" style={{ animationDuration: '40s' }}>
              {[...reviews, ...reviews].map((r, i) => (
                <li key={i} className="min-w-[260px] sm:min-w-[320px]">
                  <div className="rounded-2xl bg-white/92 backdrop-blur shadow-lg border border-[hsl(var(--border)/0.8)]
                                  p-4 sm:p-5 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Star className="w-4 h-4 text-[hsl(var(--accent))]" />
                      <span className="font-semibold text-foreground text-sm sm:text-base">{r.name}</span>
                    </div>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm sm:text-base">“{r.quote}”</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA (updated copy to match hero) */}
      <section className="py-16 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 sm:p-10 md:p-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Ready to design something people love?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mt-3 sm:mt-4">
              Let’s collaborate and bring your vision to life with thoughtful UX, clean UI, and systems that scale.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg font-semibold text-white shadow-lg
                           bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]
                           focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleConsultationClick}
              >
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-auto rounded-full px-7 text-base sm:text-lg
                           focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Link to="/portfolio">See recent work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
