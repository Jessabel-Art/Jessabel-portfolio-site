import React, { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * SkillsPourSection
 *  - Bubbles start inside the cup, rise to the rim, spill over, then snap into a grid.
 *  - Outline + text use your warm-brown; hover fill is pink.
 */
const SkillsPourSection = ({
  title = 'What I bring to every project',
  subtitle = 'A blend of research, structure, and craft that pours into outcomes.',
  skills = [
    'UX Research',
    'Usability Testing',
    'Information Architecture',
    'Wireframing',
    'Prototyping',
    'Design Systems',
    'Accessibility (WCAG)',
    'UI Design',
    'Analytics',
    'Heuristic Review',
    'Figma',
    'Interaction Design',
  ],
}) => {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once: true, amount: 0.35 });

  // --- Layout knobs (percentages are relative to the section box) ---
  // Cup bounding box (roughly matches the SVG path below)
  const CUP_LEFT = 10;   // %
  const CUP_TOP = 10;    // %
  const CUP_W = 34;      // %
  const CUP_H = 78;      // %
  const RIM_Y = CUP_TOP + 6; // % y-position of rim for animation keyframe

  // Grid (landing) area to the right of the cup
  const GRID_LEFT = CUP_LEFT + CUP_W + 6; // %
  const GRID_TOP = CUP_TOP + 4;           // %
  const COLS = 4;                         // 3-4 rows depending on count
  const ROW_GAP = 18;                     // % vertical spacing between rows
  const COL_GAP = 11;                     // % horizontal spacing between columns
  const SIZE = 104;                       // px diameter for chips

  const WARM_BROWN = 'var(--warm-brown-hex, #5a3e34)'; // fallback just in case

  // Landing positions for bubbles
  const targets = useMemo(() => {
    return skills.map((_, i) => {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      return {
        xPct: GRID_LEFT + c * COL_GAP,
        yPct: GRID_TOP + r * ROW_GAP,
      };
    });
  }, [skills]);

  // Random helper
  const rand = (min, max) => Math.random() * (max - min) + min;

  return (
    <section ref={rootRef} className="relative py-16 md:py-20 bg-[#FEE6D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-left space-y-3 sm:space-y-4 mb-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-[15px] sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Stage */}
        <div className="relative h-[560px] md:h-[620px]">
          {/* Glass */}
          <GlassSVG
            style={{
              left: `${CUP_LEFT}%`,
              top: `${CUP_TOP}%`,
              width: `${CUP_W}%`,
              height: `${CUP_H}%`,
            }}
          />

          {/* Ground shadow */}
          <div
            aria-hidden="true"
            className="absolute rounded-full opacity-40"
            style={{
              left: `${CUP_LEFT + 7}%`,
              bottom: '4%',
              width: `${CUP_W - 14}%`,
              height: 18,
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.16), transparent 70%)',
              filter: 'blur(2px)',
            }}
          />

          {/* Bubbles */}
          {skills.map((label, i) => {
            // Start from a random point INSIDE the cup body
            const startX =
              CUP_LEFT + 7 + rand(0, CUP_W - 14) * 0.7; // bias toward middle
            const startY =
              CUP_TOP + 28 + rand(0, CUP_H * 0.45); // deeper inside cup

            // A small random lateral shimmy as it rises
            const shimmy = rand(-2.5, 2.5);

            const t = targets[i] || { xPct: GRID_LEFT, yPct: GRID_TOP };
            const delay = 0.12 * i;

            const animate = prefersReducedMotion
              ? { left: `${t.xPct}%`, top: `${t.yPct}%`, opacity: 1, scale: 1 }
              : inView
              ? {
                  // keyframes: inside → rim → spill just outside → target
                  left: [
                    `${startX}%`,
                    `${startX + shimmy}%`,
                    `${startX + shimmy + 3}%`,
                    `${t.xPct}%`,
                  ],
                  top: [
                    `${startY}%`,
                    `${RIM_Y}%`,
                    `${RIM_Y + 6}%`, // just outside rim
                    `${t.yPct}%`,
                  ],
                  opacity: [0, 1, 1, 1],
                  scale: [0.95, 1, 1, 1],
                }
              : { left: `${startX}%`, top: `${startY}%`, opacity: 0, scale: 0.95 };

            const transition = prefersReducedMotion
              ? { duration: 0 }
              : {
                  times: [0, 0.45, 0.65, 1],
                  duration: 1.15,
                  delay,
                  ease: 'easeOut',
                };

            return (
              <motion.div
                key={label}
                className="absolute will-change-transform select-none"
                style={{
                  width: SIZE,
                  height: SIZE,
                  left: `${startX}%`,
                  top: `${startY}%`,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={animate}
                transition={transition}
              >
                <Chip label={label} warmBrown={WARM_BROWN} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsPourSection;

/* ----------------------------- */
/* Chip                          */
/* ----------------------------- */
const Chip = ({ label, warmBrown }) => {
  return (
    <button
      type="button"
      className="group grid place-items-center w-full h-full rounded-full font-bold text-center leading-tight transition-colors duration-300 backdrop-blur-[2px]"
      style={{
        color: warmBrown,
        border: `2px solid ${warmBrown}`,
        background:
          'linear-gradient(180deg, rgba(255,62,165,0) 0%, rgba(255,62,165,0.03) 100%)',
      }}
      title={label}
      aria-label={label}
    >
      <span className="px-3 text-sm sm:text-base">{label}</span>

      {/* Hover fill (deeper pink) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(135deg, #ff3ea5 0%, #d61a82 100%)',
          boxShadow: '0 18px 38px rgba(0,0,0,.18) inset',
          mixBlendMode: 'normal',
        }}
      />
      {/* Lift text above the fill and switch to white on hover */}
      <span className="absolute inset-0 grid place-items-center rounded-full pointer-events-none transition-colors duration-300 group-hover:text-white" />
    </button>
  );
};

/* ----------------------------- */
/* Glass outline (SVG)           */
/* ----------------------------- */
const GlassSVG = ({ style }) => (
  <svg viewBox="0 0 520 720" className="absolute" style={style} aria-hidden="true">
    <defs>
      <linearGradient id="glassStroke" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,.9)" />
        <stop offset="1" stopColor="rgba(255,255,255,.7)" />
      </linearGradient>
    </defs>
    {/* cup body */}
    <path
      d="M115 90 L75 520 C63 630 185 672 260 672 C335 672 457 630 445 520 L405 90"
      fill="none"
      stroke="url(#glassStroke)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* rim */}
    <path
      d="M120 96 Q260 72 400 96"
      fill="none"
      stroke="url(#glassStroke)"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);
