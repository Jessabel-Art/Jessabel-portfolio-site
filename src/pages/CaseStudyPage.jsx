import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ExternalLink, CheckCircle, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

/** Optional local cover fallbacks by slug/id/title key (match your assets) */
const COVER_MAP = {
  'sanchez-services': '/assets/projects/sanchez-cover-1600x1200.jpg',
  'santos-3d-customs': '/assets/projects/santos3d-cover-1600x1200.jpg',
  'itsfaceart': '/assets/projects/itsfaceart-cover-1600x1200.jpg',
};
const keyFromProject = (p = {}) =>
  (p.slug || p.id || p.title || '').toString().toLowerCase().replace(/\s+/g, '-');
const placeholder = (i = 1) => `https://picsum.photos/seed/cs-${i}/1600/1000`;

const CaseStudyPage = ({ projects = [] }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Support either `id` OR `slug` in your data
  const projectIndex = projects.findIndex(
    (p) => String(p.id) === String(projectId) || String(p.slug) === String(projectId)
  );
  const project = projectIndex >= 0 ? projects[projectIndex] : null;

  if (!project) {
    return (
      <div className="py-20 text-center">
        <Helmet>
          <title>Project Not Found - Jessabel.Art</title>
        </Helmet>
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">Project Not Found</h1>
        <Link
          to="/portfolio"
          className="mt-4 inline-block underline underline-offset-4 text-[hsl(var(--foreground))]"
        >
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const nextExists = projects.length > 1;
  const nextProjectIndex = nextExists ? (projectIndex + 1) % projects.length : null;
  const nextProjectKey = nextExists
    ? projects[nextProjectIndex].id || projects[nextProjectIndex].slug
    : null;

  const heroSrc = (() => {
    const key = keyFromProject(project);
    if (project.heroImage && project.heroImage.trim().length > 0) return project.heroImage;
    if (key && COVER_MAP[key]) return COVER_MAP[key];
    return placeholder(projectIndex + 1);
  })();

  const isGif = typeof heroSrc === 'string' && /\.gif(\?.*)?$/i.test(heroSrc);
  const hasVideo = Boolean(project.heroVideo); // mp4/webm source URL

  const handleLiveDemoClick = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    toast({
      title: '🚧 Live Demo Not Available',
      description: "This project isn't live yet, but thanks for your interest!",
    });
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const title = project.title || 'Case Study';
  const desc =
    project.overview ||
    project.shortDescription ||
    'A UX/UI and branding case study by Jessabel Santos.';

  return (
    <div>
      <Helmet>
        <title>{title} - Case Study</title>
        <meta name="description" content={desc} />
        {project.heroImage && <meta property="og:image" content={project.heroImage} />}
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center overflow-clip">
        <figure className="absolute inset-0 z-0">
          {hasVideo ? (
            <video
              className="w-full h-full object-cover"
              src={project.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={heroSrc}
              alt={`${title} hero`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              sizes="100vw"
              onError={(e) => {
                e.currentTarget.src = placeholder(projectIndex + 1);
              }}
            />
          )}
          {/* Readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60" aria-hidden="true" />
        </figure>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-4 px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
          <p className="text-xl text-white/85">
            Case Study {project.year ? `/ ${project.year}` : ''}
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Live demo / PDF CTAs */}
        <motion.div {...fadeIn} className="text-center mb-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleLiveDemoClick}
            size="lg"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
            aria-label={project.liveUrl ? 'View live demo in a new tab' : 'Live demo not available'}
          >
            {project.liveUrl ? 'View Live Demo' : 'Live Demo'}
            <ExternalLink className="ml-2 h-5 w-5 inline-block" />
          </Button>

          {project.pdfUrl && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4"
              aria-label="Download case study PDF"
            >
              <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer">
                Download PDF <Download className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            {desc && (
              <motion.section {...fadeIn}>
                <h2 className="text-3xl font-bold gradient-text mb-4">Overview</h2>
                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
              </motion.section>
            )}

            {/* Challenges */}
            {Array.isArray(project.challenges) && project.challenges.length > 0 && (
              <motion.section {...fadeIn}>
                <h2 className="text-3xl font-bold gradient-text-alt mb-4">Challenges</h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-[hsl(var(--accent))] mr-3 mt-1 flex-shrink-0" />
                      <span className="text-lg text-[hsl(var(--muted-foreground))]">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Process */}
            {Array.isArray(project.process) && project.process.length > 0 && (
              <motion.section {...fadeIn}>
                <h2 className="text-3xl font-bold gradient-text mb-6">Process</h2>
                <div className="relative space-y-8">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[hsl(var(--border))] rounded-full" />
                  {project.process.map((step, index) => (
                    <div key={index} className="pl-12 relative">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">{step.title}</h3>
                      <p className="text-[hsl(var(--muted-foreground))]">{step.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside {...fadeIn} className="space-y-8">
            {Array.isArray(project.metrics) && project.metrics.length > 0 && (
              <div className="glass p-6 rounded-lg border border-[hsl(var(--border))]">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">Impact</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {project.metrics.map((m, i) => (
                    <li key={i} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 text-center">
                      <p className="text-3xl font-extrabold text-[hsl(var(--foreground))] leading-none">{m.value}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{m.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(project.myRole) && project.myRole.length > 0 && (
              <div className="glass p-6 rounded-lg border border-[hsl(var(--border))]">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">My Role</h3>
                <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                  {project.myRole.map((role, index) => (
                    <li key={index} className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-[hsl(var(--accent))] mr-2 flex-shrink-0" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(project.tools) && project.tools.length > 0 && (
              <div className="glass p-6 rounded-lg border border-[hsl(var(--border))]">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 rounded-full text-sm
                                 bg-[hsl(var(--foreground))/0.06] text-[hsl(var(--foreground))]
                                 border border-[hsl(var(--border))]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>

        {/* Solutions & Outcomes */}
        {Array.isArray(project.solutions) && project.solutions.length > 0 && (
          <motion.section {...fadeIn} className="mt-16">
            <h2 className="text-3xl font-bold gradient-text text-center mb-6">
              Solutions & Outcomes
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {project.solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="glass p-6 rounded-xl border border-[hsl(var(--border))] transform-gpu will-change-transform"
                >
                  <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">{solution}</h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Gallery (images or videos) */}
        {Array.isArray(project.gallery) && project.gallery.length > 0 && (
          <motion.section {...fadeIn} className="mt-16">
            <h2 className="text-3xl font-bold gradient-text-alt text-center mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.gallery.map((asset, index) => {
                const isVid = typeof asset === 'string' && /\.(mp4|webm|mov)(\?.*)?$/i.test(asset);
                return (
                  <motion.figure key={index} whileHover={{ scale: 1.03 }} className="aspect-square rounded-lg overflow-hidden">
                    {isVid ? (
                      <video
                        src={asset}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={asset}
                        alt={`${title} gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </motion.figure>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Navigation */}
        <motion.section
          {...fadeIn}
          className="mt-20 flex flex-col sm:flex-row gap-4 justify-between items-center"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/portfolio')}
            className="border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--foreground))/0.06] hover:text-[hsl(var(--foreground))] group"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Projects
          </Button>

          {nextExists && (
            <Button
              onClick={() => navigate(`/portfolio/${nextProjectKey}`)}
              className="btn-primary inline-flex items-center"
            >
              View Next Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default CaseStudyPage;

