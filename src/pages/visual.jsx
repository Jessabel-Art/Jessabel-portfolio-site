import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Sparkles, Star, DraftingCompass, Fingerprint, SearchCheck, Layers, BarChart2, TestTube2, Group } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from '@/hooks/use-media-query';

const AnimatedHeadline = ({ text }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.5 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-5xl md:text-7xl font-serif font-extrabold text-foreground leading-tight"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="mr-3 inline-block"
        >
          {word === "usability" || word === "design." ? (
            <span className="relative inline-block">
              <span className="gradient-text">{word}</span>
              <motion.span
                className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-r from-accent to-secondary animated-gradient"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent' }}
                animate={{ backgroundPosition: ['200% 50%', '0% 50%'] }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1 + index * 0.1, repeat: Infinity, repeatType: 'reverse' }}
              />
            </span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const skills = [
  { icon: DraftingCompass, label: "Wireframing" },
  { icon: Fingerprint, label: "Prototyping" },
  { icon: SearchCheck, label: "Accessibility" },
  { icon: Layers, label: "Info. Architecture" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Group, label: "Design Systems" },
  { icon: TestTube2, label: "Usability Testing" },
];

const PouringCupAnimation = () => {
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (isReducedMotion) {
    return (
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-center">My Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center justify-center p-4 bg-card/80 rounded-2xl border"
            >
              <skill.icon className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold text-center">{skill.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <motion.div
        className="absolute bottom-0 left-4 md:left-1/2 md:-translate-x-[450px] w-48 h-48"
        animate={{ rotate: [-5, 15, -5] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      >
        <svg viewBox="0 0 100 100" className="fill-current text-foreground/80 drop-shadow-lg">
          <path d="M10 90 Q 50 100 90 90 L 95 20 Q 50 10 5 20 Z" />
          <path d="M10 90 Q 50 80 90 90" fill="hsl(var(--accent)/0.3)" />
           <motion.ellipse cx="50" cy="20" rx="45" ry="8"
            className="fill-current text-background"
             animate={{ scaleY: [1, 1.05, 1] }}
             transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          />
        </svg>
      </motion.div>
      <AnimatePresence>
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: '50vw',
              y: '80vh',
              scale: 0,
            }}
            animate={{
              x: ['50vw', `calc(50vw + ${Math.random() * 300 - 150}px)`, `calc(50vw + ${((i % 4) - 1.5) * 120}px)`],
              y: ['80vh', `calc(40vh + ${Math.random() * 100 - 50}px)`, `calc(50vh + ${Math.floor(i / 4) * 100}px)`],
              scale: [0, 1.2, 1],
              rotate: [Math.random() * 360, 0],
            }}
            transition={{
              duration: 6,
              ease: 'circOut',
              delay: 1 + i * 0.3,
              times: [0, 0.6, 1],
            }}
            style={{
              left: 0,
              top: 0
            }}
          >
            <div className="flex flex-col items-center justify-center p-4 bg-card/80 backdrop-blur-sm rounded-2xl border shadow-lg pointer-events-auto">
              <skill.icon className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold text-center">{skill.label}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};


const Section = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 24 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
};

const HomePage = () => {
  const featuredProjects = projects.slice(0, 3);
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-x-hidden">
      <Helmet>
        <title>Jessabel Santos · UX/UI Designer & Storyteller</title>
        <meta name="description" content="Jessabel Santos is a UX/UI designer crafting digital experiences where usability meets beautiful design." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden pt-24">
        <motion.div
          style={!isReducedMotion ? { y: parallaxY } : {}}
          className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-amber-50/20 to-background -z-10"
        />
        <PouringCupAnimation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 z-10">
          <AnimatedHeadline text="Crafting digital stories where usability meets beautiful design." />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground"
          >
            I’m Jessabel, a UX/UI designer blending business, branding, and problem-solving to create interfaces people actually enjoy using.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 2.7 }}
            className="flex items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="btn-primary text-lg relative overflow-hidden group">
              <Link to="/portfolio">
                View My Work
                <Sparkles className="absolute -right-2 -top-2 w-8 h-8 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-2">
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
            <p className="mt-3 text-lg text-muted-foreground">A glimpse into my creative process and results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link to={`/portfolio/${project.id}`} key={project.id}>
                <motion.div
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="bg-card rounded-2xl overflow-hidden border shadow-sm h-full flex flex-col group relative"
                >
                  <div className="aspect-video overflow-hidden">
                    <motion.div
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="w-full h-full"
                    >
                      <img
                        className="w-full h-full object-cover"
                        alt={project.title}
                        src="https://images.unsplash.com/photo-1680016661694-1cd3faf31c3a" 
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{project.shortDescription}</p>
                    <motion.div
                      variants={{
                        rest: { opacity: 0, y: 10 },
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                      className="flex flex-wrap gap-2 mt-auto"
                    >
                      {project.tags.map(tag => (
                        <motion.span
                          key={tag}
                          variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
                          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border rounded-2xl p-10 md:p-16 text-center shadow-lg">
            <Sparkles className="mx-auto w-12 h-12 text-accent mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a project in mind?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Let's collaborate and bring your vision to life with exceptional design, strategy, and user experience.
            </p>
            <Button asChild size="lg" className="btn-secondary text-lg">
              <Link to="/contact">Let's Create Something Together</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;