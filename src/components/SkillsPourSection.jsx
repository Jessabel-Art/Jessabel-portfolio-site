import React, { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

/**
 * SkillsPourSection
 * - Animated "glass half full" that pours skill circles which then align into a grid.
 *
 * Props:
 *  - skills: string[]  (defaults included below)
 *  - title?: string
 *  - subtitle?: string
 */
const SkillsPourSection = ({
  skills = [
    'UX Research','Usability Testing','Information Architecture','Wireframing',
    'Prototyping','Design Systems','Accessibility (WCAG)','UI Design',
    'Analytics','Heuristic Review','Figma','Interaction Design'
  ],
  title = 'What I bring to every project',
  subtitle = 'A blend of research, structure, and craft that pours into outcomes.'
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px', amount: 0.4, once: true });

  // Layout controls
  const GRID_COLS = 4; // grid on the right
  const GRID_GAP = 14; // px
  const CIRCLE = 68; // diameter px (responsive min)

  // Precompute grid coords so we can animate-to exact positions
  const gridTargets = useMemo(() => {
    const items = skills.length;
    return Array.from({ length: items }).map((_, i) => {
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      return {
        x: col * (CIRCLE + GRID_GAP),
        y: row * (CIRCLE + GRID_GAP),
      };
    });
  }, [skills.length]);

  // Cup “spawn” positions (inside the glass). We randomize slightly so circles don’t overlap perfectly.
  const cupSeeds = useMemo(() => {
    return skills.map((s, i) => {
      const r = CIRCLE / 2;
      // spawn in a wedge (lower half of cup)
      const baseX = 70 + (i % 4) * (r * 0.9);
      const baseY = 80 + Math.floor(i / 4) * (r * 0.8);
      return {
        x: baseX + rand(-8, 8),
        y: baseY + rand(-6, 6),
        rot: rand(-12, 12),
        delay: i * 0.045 + (i % 3) * 0.05,
      };
    });
  }, [skills.length]);

  const sectionTitle = (
    <header className="mb-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[hsl(var(--foreground))]">
        {title}
      </h2>
      <p className="mt-2 text-lg" style={{ color: 'var(--warm-brown-hex)' }}>
        {subtitle}
      </p>
    </header>
  );

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-[#FEE6D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionTitle}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT: The “glass” */}
          <div className="relative h-[420px] md:h-[460px]">
            <GlassSVG />

            {/* falling tokens (positioned relative to the glass box) */}
            <div className="absolute left-10 top-6 w-[280px] h-[360px] md:left-14 md:top-6 md:w-[320px] md:h-[380px]">
              {!prefersReducedMotion && skills.map((label, i) => (
                <SkillToken
                  key={label + i}
                  label={label}
                  start={cupSeeds[i]}
                  // “Drop out” distance and curve
                  dropY={120 + (i % 4) * 6}
                  dropX={rand(-16, 18)}
                  delay={cupSeeds[i].delay}
                  size={CIRCLE}
                />
              ))}

              {/* reduced motion: render static cup content only */}
              {prefersReducedMotion && (
                <StaticCupCloud skills={skills} size={CIRCLE} />
              )}
            </div>
          </div>

          {/* RIGHT: The final aligned grid (our tokens animate-to these coordinates) */}
          <div className="relative min-h-[320px]">
            <div
              className="relative"
              style={{
                height: rowsNeeded(skills.length, GRID_COLS) * (CIRCLE + GRID_GAP) - GRID_GAP,
              }}
            >
              {skills.map((label, i) => {
                const tgt = gridTargets[i];
                return (
                  <motion.div
                    key={'grid-' + label + i}
                    className="absolute will-change-transform"
                    initial={prefersReducedMotion ? { x: tgt.x, y: tgt.y } : { x: tgt.x, y: tgt.y, opacity: 0 }}
                    animate={inView && !prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 + i * 0.03 }}
                    style={{ transform: `translate(${tgt.x}px, ${tgt.y}px)` }}
                  >
                    <Token label={label} size={CIRCLE} active />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------- Pieces ------------------- */

const Token = ({ label, size = 64, active = false }) => (
  <div
    className={`rounded-full select-none border text-sm font-semibold flex items-center justify-center shadow-sm ${
      active ? 'bg-[hsl(var(--accent))] text-[#0B0F1A] border-[hsl(var(--border))]'
             : 'bg-white/70 text-[hsl(var(--foreground))] border-[hsl(var(--border)/0.6)]'
    }`}
    style={{ width: size, height: size, padding: 8, lineHeight: 1.1 }}
    title={label}
  >
    <span className="px-2 text-center">{label}</span>
  </div>
);

// The animated “pour” token
const SkillToken = ({ label, start, dropY = 120, dropX = 0, delay = 0, size = 64 }) => {
  const [poured, setPoured] = useState(false);

  return (
    <motion.div
      className="absolute will-change-transform"
      initial={{ x: start.x, y: start.y, rotate: start.rot, opacity: 1 }}
      animate={
        poured
          ? { y: start.y + dropY, x: start.x + dropX, rotate: start.rot + rand(-12, 12), opacity: 0 }
          : { x: start.x, y: start.y, rotate: start.rot }
      }
      transition={{ duration: 0.7, ease: 'easeIn', delay }}
      onAnimationComplete={() => setPoured(true)}
      // aria-hidden because we’ll read the final grid tokens
      aria-hidden="true"
    >
      <Token label={label} size={size} />
    </motion.div>
  );
};

// For reduced‑motion users, show a simple clustered set in the cup
const StaticCupCloud = ({ skills, size }) => (
  <div className="flex flex-wrap gap-2">
    {skills.slice(0, 6).map((s, i) => (
      <div key={s + i} style={{ transform: `translate(${(i % 3) * (size * 0.6)}px, ${Math.floor(i / 3) * (size * 0.6)}px)` }}>
        <Token label={s} size={size * 0.7} />
      </div>
    ))}
  </div>
);

// “Invisible glass” outline with frosted fill (no image needed)
const GlassSVG = () => (
  <svg
    className="absolute left-6 top-0 w-[340px] h-[420px] md:left-10 md:w-[380px] md:h-[460px]"
    viewBox="0 0 380 460"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="frost" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    {/* cup body */}
    <path
      d="M40 30 H340 L300 390 Q295 430 190 430 Q85 430 80 390 Z"
      fill="url(#frost)"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="2"
    />
    {/* rim highlight */}
    <path d="M40 30 H340" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
    {/* subtle shadow */}
    <ellipse cx="190" cy="448" rx="120" ry="10" fill="rgba(0,0,0,0.06)" />
  </svg>
);

/* ------------------- helpers ------------------- */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function rowsNeeded(n, cols) {
  return Math.ceil(n / cols);
}

export default SkillsPourSection;
