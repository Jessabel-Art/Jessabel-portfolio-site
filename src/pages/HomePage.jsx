import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Briefcase, BarChart, PenTool, Lightbulb, UserCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// 🔸 Local HERO image (replace the extension if yours differs)
import heroBg from '@/assets/images/hero-bg.jpg'; // or .png/.webp

const HomePage = () => {
  const handleConsultationClick = () => {
    toast({
      title: 'Let’s make something delightful ✨',
      description: 'Taking you to the contact page to start a quick jam session.',
    });
  };

  const expertise = [
    { icon: Briefcase, title: 'UX/UI Design', description: 'Intuitive, accessible, visually engaging interfaces.' },
    { icon: Lightbulb, title: 'Prototyping', description: 'Interactive mockups for rapid iteration and clarity.' },
    { icon: UserCheck, title: 'User Research', description: 'Testing, surveys, and observation for real insights.' },
    { icon: PenTool, title: 'Branding', description: 'Cohesive, memorable systems that scale.' },
    { icon: BarChart, title: 'UX Strategy', description: 'Business goals aligned to user expectations.' },
    { icon: Briefcase, title: 'Career & Biz Support', description: 'Roadmaps, positioning, and GTM ops that work.' },
  ];

  // ✅ 6 realistic reviews, one marquee row only, no visible boxes
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
        <title>Jessabel.Art · UX/UI Designer</title>
        <meta
          name="description"
          content="I map Ideas onto Screens — UX/UI, branding, and prototypes people actually enjoy using."
        />
      </Helmet>

      {/* HERO (now using local image) */}
      <section className="hero relative min-h-[86vh] grid place-items-center overflow-clip">
        <img src={heroBg} alt="" className="hero-image" loading="eager" decoding="async" />
        <div className="hero-overlay" />

        <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="hero-title bubble">
              <span>
                I map <em>Ideas</em>
              </span>
              <span>
                onto <em>Screens</em>
              </span>
            </h1>

            <p className="hero-subtext">
              Crafting experiences with UX/UI, branding, and prototypes people actually enjoy using.
            </p>

            <div className="hero-ctas mt-8 flex items-center gap-4">
              <Button asChild size="lg" className="btn-primary rounded-full px-6">
                <Link to="/contact" onClick={handleConsultationClick} aria-label="Start a project">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 border-white/30 text-white bg-white/10 backdrop-blur hover:bg-white/20"
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
      <section className="relative z-10 -mt-6 md:-mt-8 py-16 md:py-20 bg-[hsl(var(--background))] rounded-t-[28px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left space-y-4 mb-10">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">What I Bring to Every Project</h2>
            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
              Strategy, taste, and rigorous usability—delivered through clear process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
                  className={`relative rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-all ring-1 ring-transparent hover:${accent.ring}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${accent.chip}`} />
                  <div className="p-7">
                    <div className={`w-12 h-12 rounded-xl ${accent.bg} flex items-center justify-center mb-5`}>
                      <Icon className={`${accent.chip.replace('bg-', 'text-')}`} size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-muted-foreground">{s.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔻 RECENT WORK section removed per request */}

      {/* TESTIMONIALS — single marquee row, subtle/invisible containers */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-foreground mb-10"
          >
            Kind words from collaborators
          </motion.h2>

          <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex gap-6 animate-infinite-scroll" style={{ animationDuration: '36s' }}>
              {[...reviews, ...reviews].map((r, i) => (
                <li key={i} className="min-w-max px-4 py-2">
                  <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                    <Star className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <p className="whitespace-nowrap">
                      <span className="font-semibold text-foreground">{r.name}:</span> “{r.quote}”
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to start your project?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
              Let’s collaborate and bring your vision to life with exceptional design, strategy, and user experience.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="btn-primary rounded-full px-6" onClick={handleConsultationClick}>
                <Link to="/contact">
                  Start a 15-min jam session 🎧
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border rounded-full px-6">
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



 
